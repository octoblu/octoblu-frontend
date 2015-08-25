class GatebluLogService
  constructor: (skynetService, GATEBLU_LOGGER_UUID, $cookies) ->
    @skynetService       = skynetService

    @APPLICATION         = "APP_OCTOBLU"
    @GATEBLU_LOGGER_UUID = GATEBLU_LOGGER_UUID
    @userUuid            = $cookies.meshblu_auth_uuid

  registerDeviceBegin: (device)=>
    @logEvent "device-add-to-gateblu", "begin", { type: device.type }

  registerDeviceEnd: (device)=>
    @logEvent "device-add-to-gateblu", "register-device-end", { uuid: device.uuid, type: device.type }

  updateGatebluBegin: (gateblu) =>
    @logEvent "device-add-to-gateblu", "gateblu-update-begin", { uuid: gateblu.uuid, type: gateblu.type, devices: gateblu.devices}

  updateGatebluEnd: (device) =>
    @logEvent "device-add-to-gateblu", "gateblu-update-end",  { uuid: device.uuid, type: device.type }

  deviceOptionsLoaded: (device) =>
    @logEvent "device-add-to-gateblu", "end", { uuid: device.uuid, type: device.type }

  logEvent: (workflow, state, device) =>
    payload =
      application: @APPLICATION
      workflow: workflow
      state: state
      userUuid: @userUuid
      device: device

    @skynetService.sendMessage
      devices: @GATEBLU_LOGGER_UUID
      payload: payload

angular.module('octobluApp').service 'GatebluLogService', GatebluLogService
