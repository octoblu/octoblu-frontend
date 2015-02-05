_    = require 'lodash'
When = require 'when'
queryTemplate = require '../../assets/json/elasticsearch/topic-summary.json'

class TopicSummary
  constructor: ( elasticSearchUrl, ownerUuid, dependencies={}) ->
    @elasticSearchUrl = elasticSearchUrl
    @ownerUuid        = ownerUuid
    @request = dependencies.request ? require 'request'
    DeviceCollection = dependencies.DeviceCollection ? require '../collections/device-collection'
    @deviceCollection = new DeviceCollection ownerUuid

  fetch: =>
    @deviceCollection.fetchAll().then (devices) =>
      uuids = _.pluck devices, 'uuid'
      uuids.unshift @ownerUuid
      When.promise (resolve, reject) =>
        @request @requestParams(uuids), (error, response, body) =>
          return reject error if error?
          return reject new Error('elasticsearch error') unless response.statusCode == 200
          resolve @parseResponse body

  parseResponse: (response) =>
    _.map response.aggregations.topic_summary.topics.buckets, (bucket) =>
      {topic: bucket.key, count: bucket.doc_count}

  requestParams: (uuids)=>
    method: 'POST'
    url:    "#{@elasticSearchUrl}/skynet_trans_log/_search?search_type=count"
    json:   @query uuids

  query: (uuids) =>
    queryTemplate.aggs.topic_summary.filter.and[1].or =
      _.flatten _.map uuids, (uuid) => [
        {term: {'@fields.fromUuid.raw': uuid}}
        {term: {'@fields.toUuid.raw': uuid}}
      ]

    queryTemplate


module.exports = TopicSummary
