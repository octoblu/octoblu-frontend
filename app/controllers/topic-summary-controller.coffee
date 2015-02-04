TopicSummary = require '../models/topic-summary'

class TopicSummaryController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    topic_summary = new TopicSummary @elasticSearchUri, request.user.skynet.uuid
    topic_summary.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.send 500, error

module.exports = TopicSummaryController
