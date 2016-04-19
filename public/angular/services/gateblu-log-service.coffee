angular.module("octobluApp").factory "GatebluLogService", (MeshbluHttpService, GATEBLU_LOGGER_UUID, $cookies, UUIDService) ->
  class GatebluLogService
    constructor: () ->
      @deploymentUuid = UUIDService.v1()
      @userUuid       = $cookies.meshblu_auth_uuid
      @APPLICATION    = "app-octoblu"
      @WORKFLOW       = 'device-add-to-gateblu'

    addDeviceBegin: (gatebluUuid, connector) =>
      @logEvent "begin", null, gatebluUuid, connector

    registerDeviceBegin: (gatebluUuid, connector) =>
      @logEvent "register-device-begin", null, gatebluUuid, connector

    registerDeviceEnd: (deviceUuid, gatebluUuid, connector) =>
      @logEvent "register-device-end", deviceUuid, gatebluUuid, connector

    updateGatebluBegin: (deviceUuid, gatebluUuid, connector) =>
      @logEvent "gateblu-update-begin", deviceUuid, gatebluUuid, connector

    updateGatebluEnd: (deviceUuid, gatebluUuid, connector) =>
      @logEvent "gateblu-update-end", deviceUuid, gatebluUuid, connector

    deviceOptionsLoadBegin: (deviceUuid, gatebluUuid, connector) =>
      @logEvent "device-options-load-begin", deviceUuid, gatebluUuid, connector

    deviceOptionsLoadEnd: (deviceUuid, gatebluUuid, connector) =>
      @logEvent "device-options-load-end", deviceUuid, gatebluUuid, connector

    addDeviceEnd: (deviceUuid, gatebluUuid, connector) =>
      @logEvent "end", deviceUuid, gatebluUuid, connector

    logEvent: (state, deviceUuid, gatebluUuid, connector) =>
      payload =
        date: Date.now()
        deploymentUuid: @deploymentUuid
        application: @APPLICATION
        workflow: @WORKFLOW
        userUuid: @userUuid
        state: state
        deviceUuid: deviceUuid
        gatebluUuid: gatebluUuid
        connector: connector

      message =
        devices: GATEBLU_LOGGER_UUID
        payload: payload

      MeshbluHttpService.message message, _.noop
