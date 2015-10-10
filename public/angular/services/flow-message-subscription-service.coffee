class FlowMessageSubscriptionService
  constructor: (skynetService) ->
    @skynetService = skynetService

  setupSubscriptions: (flowUUID, scope) =>
    @skynetService.getSkynetConnection().then (skynetConnection) ->
      skynetConnection.subscribe uuid: flowUUID, types: ['received', 'broadcast']
      skynetConnection.on 'message', (message) ->
        return unless message.topic?

        switch message.topic
          when "debug"
            console.log("FlowMessageSubscriptionService:DEBUG ", message, message.payload.name, message.payload.msgType)
            scope.$broadcast("flow-node-debug", message) if message.payload.name == 'Debug'
            scope.$broadcast("flow-node-error", message) if message.payload.msgType == 'error'
          when "pulse"
            scope.$broadcast("flow-node-pulse", message)

angular.module('octobluApp').service 'FlowMessageSubscriptionService', FlowMessageSubscriptionService
