class WebhookController
  constructor: (options={}) ->
    @meshblu = options.meshblu
    @Flow = options.Flow ? require '../models/flow'

  trigger: (request, response) =>
    triggerId = request.params.id
    @Flow.findOne 'nodes.id': triggerId
      .then (flow) =>
        message =
          devices: [flow.flowId]
          topic: 'webhook'
          payload:
            from: triggerId
            params: request.body

        @meshblu.message message
        response.status(201).end()
      .then null, (err) =>
        response.status(404).end()

module.exports = WebhookController
