MessageSummary = require '../models/message-summary'
airbrake = require('airbrake').createClient process.env.AIRBRAKE_KEY

class MessageSummaryController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    uuid = request.cookies.meshblu_auth_uuid
    token = request.cookies.meshblu_auth_token
    message_summary = new MessageSummary @elasticSearchUri, uuid, token
    message_summary.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.send 500, error: error.message
        airbrake.notify error

module.exports = MessageSummaryController
