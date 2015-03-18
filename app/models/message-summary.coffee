_             = require 'lodash'
When          = require 'when'
queryTemplate = require '../../assets/json/elasticsearch/message-summary.json'

class MessageSummary
  constructor: (elasticSearchUrl, @ownerUuid, @ownerToken, dependencies={})->
    @elasticSearchUrl = elasticSearchUrl
    DeviceCollection = dependencies.DeviceCollection ? require '../collections/device-collection'
    @request         = dependencies.request ? require 'request'
    @deviceCollection = new DeviceCollection @ownerUuid, @ownerToken

  fetch: =>
    @deviceCollection.fetchAll().then (devices) =>
      When.promise (resolve, reject) =>
        uuids = [@ownerUuid].concat _.pluck(devices, 'uuid')

        requestParams = @requestParams(uuids)
        @request requestParams, (error, response, body) =>
          return reject error if error?

          unless response.statusCode == 200
            error = new Error('elasticsearch error')
            error.statusCode    = response.statusCode
            error.body          = response.body
            error.requestParams = requestParams
            return reject error

          resolve @processResponse body.aggregations

  processResponse: (aggregations) =>
    results = {}

    _.each aggregations.sent.sent.buckets, (bucket) =>
      results[bucket.key] =
        uuid: bucket.key
        sent: bucket.doc_count
        received: 0

    _.each aggregations.received.received.buckets, (bucket) =>
      results[bucket.key] ?= uuid: bucket.key, sent: 0
      results[bucket.key].received = bucket.doc_count

    _.values results



  requestParams: (uuids) =>
    fromUuids = _.map uuids, (uuid) =>
      term: {'fromUuid.raw': uuid}

    toUuids = _.map uuids, (uuid) =>
      term: {'toUuid.raw': uuid}

    queryTemplate.aggs.sent.filter.or = fromUuids
    queryTemplate.aggs.received.filter.or = toUuids

    url: "#{@elasticSearchUrl}/meshblu_events_300/_search?search_type=count"
    method: 'POST',
    json: queryTemplate

module.exports = MessageSummary
