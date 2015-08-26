class FlowLogService
  constructor: (skynetService, FLOW_LOGGER_UUID, $cookies) ->
    @skynetService = skynetService
    @FLOW_LOGGER_UUID = FLOW_LOGGER_UUID
    @userUuid = $cookies.meshblu_auth_uuid
    @application = "ui-flow"

  logBegin: (flowId, workflow, message) =>
    @log flowId, workflow, 'begin', message

  logEnd: (flowId, workflow, message) =>
    @log flowId, workflow, 'end', message

  logError: (flowId, workflow, message) =>
    @log flowId, workflow, 'error', message

  log: (flowId, workflow, state, message) =>
    @skynetService.sendMessage
      devices: @FLOW_LOGGER_UUID
      payload:
        userUuid: @userUuid
        application: @application
        flowUuid: flowId
        workflow: workflow
        state: state
        message: message


angular.module("octobluApp").service "FlowLogService", FlowLogService
