angular.module("octobluApp").factory "FlowLogService",
(skynetService, FLOW_LOGGER_UUID, $cookies) ->
  class FlowLogService
    constructor: (flowUuid, workflow, deploymentUuid) ->
      @flowUuid = flowUuid
      @workflow = workflow
      @deploymentUuid = deploymentUuid
      @userUuid = $cookies.meshblu_auth_uuid
      @application = "app-octoblu"

    logBegin: (message) =>
      @log 'begin', message

    logEnd: (message) =>
      @log 'end', message

    logError: (message) =>
      @log 'error', message

    log: (state, logMessage) =>
      message =
        devices: FLOW_LOGGER_UUID
        payload:
          date: Date.now()
          userUuid: @userUuid
          deploymentUuid: @deploymentUuid
          application: @application
          flowUuid: @flowUuid
          workflow: @workflow
          state: state
          message: logMessage

      skynetService.sendMessage message
