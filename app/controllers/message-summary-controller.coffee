MessageSummary = require '../models/message-summary'

class MessageSummaryController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    message_summary = new MessageSummary @elasticSearchUri, request.user.skynet.uuid
    message_summary.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.send 500, error: error.message
        throw error

module.exports = MessageSummaryController
