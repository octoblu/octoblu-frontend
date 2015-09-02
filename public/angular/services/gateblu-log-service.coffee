class GatebluLogService
  constructor: (skynetService, UUIDService, GATEBLU_LOGGER_UUID, $cookies) ->
    @skynetService       = skynetService
    @uuidService         = UUIDService

    @DEPLOYMENTUUID      = @uuidService.v1()
    @APPLICATION         = "app-octoblu"
    @WORKFLOW            = 'device-add-to-gateblu'
    @GATEBLU_LOGGER_UUID = GATEBLU_LOGGER_UUID
    @userUuid            = $cookies.meshblu_auth_uuid

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
      deploymentUuid: @DEPLOYMENTUUID
      application: @APPLICATION
      workflow: @WORKFLOW
      state: state
      userUuid: @userUuid
      device: device

    @skynetService.sendMessage
      devices: @GATEBLU_LOGGER_UUID
      payload: payload

angular.module('octobluApp').service 'GatebluLogService', GatebluLogService
