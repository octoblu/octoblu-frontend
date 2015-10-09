class BatchMessageService
  parseMessages: (messages, scope) ->
    return if _.isEmpty(messages)

    _.each messages, (message) ->
      switch(message.topic)
        when "debug"
          msgType = message.payload.msgType
          scope.$broadcast("flow-node-debug", message) if msgType == 'debug'
          scope.$broadcast("flow-node-error", message) if msgType == 'error'
        when "pulse"
          scope.$broadcast("flow-node-pulse", message)

angular.module('octobluApp').service 'BatchMessageService', BatchMessageService
