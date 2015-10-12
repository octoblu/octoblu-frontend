class BatchMessageService
  parseMessages: (messages, scope) ->
    return if _.isEmpty(messages)

    _.each messages, (message) ->
      switch(message.topic)
        when "debug"
          scope.$broadcast('flow-node-batch-debug', message)
        when "pulse"
          scope.$broadcast("flow-node-pulse", message)

angular.module('octobluApp').service 'BatchMessageService', BatchMessageService
