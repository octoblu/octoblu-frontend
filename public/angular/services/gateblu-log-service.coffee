angular.module("octobluApp").factory "GatebluLogService",
(skynetService, GATEBLU_LOGGER_UUID, $cookies) ->
  class GatebluLogService
    constructor: (deploymentUuid) ->
      @deploymentUuid      = deploymentUuid
      @userUuid            = $cookies.meshblu_auth_uuid
      @APPLICATION         = "app-octoblu"
      @WORKFLOW            = 'device-add-to-gateblu'

    registerDeviceBegin: (device)=>
      @logEvent "begin", { type: device.type }

    registerDeviceEnd: (device)=>
      @logEvent "register-device-end", { uuid: device.uuid, type: device.type }

    updateGatebluBegin: (gateblu) =>
      @logEvent "gateblu-update-begin", { uuid: gateblu.uuid, type: gateblu.type, devices: gateblu.devices}

    updateGatebluEnd: (device) =>
      @logEvent "gateblu-update-end",  { uuid: device.uuid, type: device.type }

    deviceOptionsLoaded: (device) =>
      @logEvent "end", { uuid: device.uuid, type: device.type }

    logEvent: (state, device) =>
      payload =
        deploymentUuid: @deploymentUuid
        application: @APPLICATION
        workflow: @WORKFLOW
        state: state
        userUuid: @userUuid
        device: device

      console.log 'deploymentuuid', payload.deploymentUuid
      skynetService.sendMessage
        devices: GATEBLU_LOGGER_UUID
        payload: payload
