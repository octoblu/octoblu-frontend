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
    @updateDeviceForGateblu().then (result) =>
      @addDeviceToGateblu(result).then (device) =>
        @loading = false
        @device = device

  addDeviceToGateblu: ([device, gatebluDevice]) =>
    @GatebluService.updateGateblu [device, gatebluDevice], @gatebluLogger
      .then =>
        @updating = false
        @GatebluService.waitForEndOfInitializing device, @gatebluLogger
      .then =>
        @gatebluLogger.addDeviceEnd device.uuid, device.gateblu, device.connector
        @getDevice()

  getDevice: =>
    @ThingService.getThing uuid: @stateParams.deviceUuid

  getDeviceWithToken: =>
    @getDevice().then (device) =>
      @ThingService.generateSessionToken uuid: device.uuid
        .then (token) =>
          device.token = token
          return device

  updateDeviceForGateblu: =>
    @getDeviceWithToken().then (device) =>
      @GatebluService.updateDevice device, @stateParams.gatebluUuid, @gatebluLogger
        .then ([newDevice, gatebluDevice]) =>
          mergedDevice = _.assign {}, device, newDevice
          return [mergedDevice, gatebluDevice]

angular.module('octobluApp').controller 'LinkSubdeviceFormController', LinkSubdeviceFormController
