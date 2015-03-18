TopicSummary = require '../models/topic-summary'
airbrake = require('airbrake').createClient process.env.AIRBRAKE_KEY

class TopicSummaryController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    uuid = request.cookies.meshblu_auth_uuid
    token = request.cookies.meshblu_auth_token
    topic_summary = new TopicSummary @elasticSearchUri, uuid, token
    topic_summary.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.send 500, error: error.message
        airbrake.notify error


module.exports = TopicSummaryController
