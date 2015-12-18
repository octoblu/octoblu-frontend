class LinkSubdeviceFormController
  constructor: ($scope, $state, $stateParams, ThingService, GatebluService, GatebluLogService) ->
    @scope = $scope
    @state = $state
    @stateParams = $stateParams
    @GatebluService = GatebluService
    @ThingService = ThingService
    @gatebluLogger = new GatebluLogService()
    @updating = true
    @loading = true
    @gatebluLogger.addDeviceBegin @stateParams.gatebluUuid
    @getDeviceWithToken().then (device) =>
      @addDeviceToGateblu(device).then =>
        @loading = false
        @device = device

  addDeviceToGateblu: (device) =>
    @ThingService.getThing uuid: @stateParams.gatebluUuid
      .then (gatebluDevice) =>
        @GatebluService.updateGateblu [device, gatebluDevice], @gatebluLogger
      .then =>
        @updating = false
        @GatebluService.waitForDeviceToHaveOptionsSchema device, @gatebluLogger
      .then =>
        @gatebluLogger.addDeviceEnd device.uuid, device.gateblu, device.connector
        @ThingService.getThing uuid: device.uuid

  getDeviceWithToken: =>
    @ThingService.getThing uuid: @stateParams.uuid
      .then (device) =>
        @ThingService.generateSessionToken(device).then (token) =>
          device.token = token
          return device

angular.module('octobluApp').controller 'LinkSubdeviceFormController', LinkSubdeviceFormController
