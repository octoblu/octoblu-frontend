angular.module("octobluApp").factory "FlowLogService", 
(skynetService, FLOW_LOGGER_UUID, $cookies, UUIDService) ->
  class FlowLogService
    constructor: (flowId, workflow) ->
      @workflow = workflow
      @deploymentUuid = UUIDService.v1()
      @userUuid = $cookies.meshblu_auth_uuid
      @application = "app-octoblu"

    logBegin: (message) =>
      @log 'begin', message

    logEnd: (message) =>
      @log 'end', message

    logError: (message) =>
      @log 'error', message

    log: (state, message) =>
      skynetService.sendMessage
        devices: FLOW_LOGGER_UUID
        payload:
          userUuid: @userUuid
          deploymentUuid: @deploymentUuid
          application: @application
          flowUuid: @flowId
          workflow: @workflow
          state: state
          message: message
