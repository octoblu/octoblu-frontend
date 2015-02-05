_    = require 'lodash'
When = require 'when'
queryTemplate = require '../../assets/json/elasticsearch/general-search.json'

omittedKeys = ['worker', 'pid', 'path', 'user', 'main', 'uptime', 'rss', 'heapTotal', 'heapUsed']

class GeneralSearch
  constructor: (@elasticSearchUrl, @searchQuery, @ownerUuid, dependencies={}) ->
    @request = dependencies.request ? require 'request'
    DeviceCollection = dependencies.DeviceCollection ? require '../collections/device-collection'
    @deviceCollection = new DeviceCollection @ownerUuid

  fetch: =>
    @deviceCollection.fetchAll().then (devices) =>
      When.promise (resolve, reject) =>
        @request @requestParams(), (error, response, body) =>
          return reject error if error?
          return reject new Error('elasticsearch error') unless response.statusCode == 200
          messages = @parseResponse body
          messages = @filterMessages messages, devices
          resolve messages

  parseResponse: (response) =>
    _.map response.hits.hits, (hit) =>
      _.omit hit._source['@fields'], omittedKeys

  filterMessages: (messages, devices) =>
    ownerUuids = _.pluck devices, 'owner'
    deviceUuids = _.pluck devices, 'uuid'

    _.filter messages, (message) =>
      if message.toUuid
        return true if @checkUuid deviceUuids, ownerUuids, message.toUuid
      if message.fromUuid
        return true if @checkUuid deviceUuids, ownerUuids, message.fromUuid

  checkUuid: (owners, uuids, uuid) =>
    _.contains owners, uuid || _.contains uuids, uuid

  requestParams: =>
    method: 'POST'
    url:    "#{@elasticSearchUrl}/skynet_trans_log/_search"
    json:   @query()

  query: =>
    queryTemplate.query.match._all.query = @searchQuery
    queryTemplate


module.exports = GeneralSearch
