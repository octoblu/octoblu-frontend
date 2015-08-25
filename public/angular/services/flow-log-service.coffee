class FlowLogService
  constructor: (skynetService, FLOW_LOGGER_UUID, $cookies) ->
    @skynetService = skynetService
    @FLOW_LOGGER_UUID = FLOW_LOGGER_UUID
    @userUuid = $cookies.meshblu_auth_uuid
    @EVENT_PREFIX = "ui-"
  logStart: (flow)=>
    @skynetService.sendMessage
      devices: @FLOW_LOGGER_UUID
      payload:
        flowUuid: flow.flowId
        userUuid: @userUuid
        action: "#{@EVENT_PREFIX}flow-start"

  logStop: (flow)=>
    @skynetService.sendMessage
      devices: @FLOW_LOGGER_UUID
      payload:
        flowUuid: flow.flowId
        userUuid: @userUuid
        action: "#{@EVENT_PREFIX}flow-stop"

angular.module('octobluApp').service 'FlowLogService', FlowLogService
