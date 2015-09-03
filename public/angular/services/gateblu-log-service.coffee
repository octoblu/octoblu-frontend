angular.module("octobluApp").factory "GatebluLogService",
(skynetService, GATEBLU_LOGGER_UUID, $cookies, UUIDService) ->
  class GatebluLogService
    constructor: () ->
      @deploymentUuid = UUIDService.v1()
      @userUuid       = $cookies.meshblu_auth_uuid
      @APPLICATION    = "app-octoblu"
      @WORKFLOW       = 'device-add-to-gateblu'

    addDeviceBegin: (nodeType) =>
      @logEvent "begin", { type: nodeType.type }

    registerDeviceBegin: (device)=>
      @logEvent "register-device-begin", { type: device.type }

    registerDeviceEnd: (device)=>
      @logEvent "register-device-end", { uuid: device.uuid, type: device.type }

    updateGatebluBegin: (gateblu) =>
      @logEvent "gateblu-update-begin", { uuid: gateblu.uuid, type: gateblu.type, devices: gateblu.devices}

    updateGatebluEnd: (device) =>
      @logEvent "gateblu-update-end",  { uuid: device.uuid, type: device.type }

    deviceOptionsLoadBegin: (device) =>
      @logEvent "device-options-load-begin", { uuid: device.uuid, type: device.type }

    deviceOptionsLoadEnd: (device) =>
      @logEvent "device-options-load-end", { uuid: device.uuid, type: device.type }

    addDeviceEnd: (device) =>
      @logEvent "end", { uuid: device.uuid, type: device.type }

    logEvent: (state, device) =>
      payload =
        deploymentUuid: @deploymentUuid
        application: @APPLICATION
        workflow: @WORKFLOW
        state: state
        userUuid: @userUuid
        device: device

      skynetService.sendMessage
        devices: GATEBLU_LOGGER_UUID
        payload: payload
