_    = require 'lodash'
When = require 'when'
queryTemplate = require '../../assets/json/elasticsearch/general-search.json'

omittedKeys = ['worker', 'pid', 'path', 'user', 'main', 'uptime', 'rss', 'heapTotal', 'heapUsed', 'to', 'from']

class GeneralSearch
  constructor: (@elasticSearchUrl, @searchQuery, @ownerUuid, @ownerToken, dependencies={}) ->
    @request = dependencies.request ? require 'request'
    DeviceCollection = dependencies.DeviceCollection ? require '../collections/device-collection'
    @deviceCollection = new DeviceCollection @ownerUuid, @ownerToken

  fetch: =>
    @deviceCollection.fetchAll().then (devices) =>
      uuids = _.pluck devices, 'uuid'
      uuids.push @ownerUuid
      When.promise (resolve, reject) =>
        requestParams = @requestParams(@searchQuery, uuids)
        @request requestParams, (error, response, body) =>
          return reject error if error?

          unless response.statusCode == 200
            error = new Error('elasticsearch error')
            error.statusCode    = response.statusCode
            error.body          = response.body
            error.requestParams = requestParams
            return reject error

          messages = @parseResponse body
          resolve messages

  parseResponse: (response) =>
    _.map response.hits.hits, (hit) =>
      _.omit hit._source, omittedKeys

  checkUuid: (owners, uuids, uuid) =>
    _.contains owners, uuid || _.contains uuids, uuid

  requestParams: (searchQuery, uuids) =>
    method: 'POST'
    url:    "#{@elasticSearchUrl}/meshblu_events_300/_search"
    json:   @query searchQuery, uuids

  query: (searchQuery, uuids) =>
    fromTerms = _.map uuids, (uuid) => {term: {'fromUuid.raw': uuid}}
    toTerms   = _.map uuids, (uuid) => {term: {'toUuid.raw':   uuid}}
    template = _.cloneDeep queryTemplate

    template.filter.or = _.union fromTerms, toTerms
    unless _.isEmpty searchQuery
      template.query =
        match:
          _all:
            query: searchQuery
    template


module.exports = GeneralSearch
