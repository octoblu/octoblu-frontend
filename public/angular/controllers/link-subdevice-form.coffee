class LinkSubdeviceFormController
  constructor: ($scope, $stateParams, ThingService, GatebluService, GatebluLogService) ->
    {@device, @gateblu} = $scope.subdeviceLink
    @GatebluService = GatebluService
    @ThingService = ThingService
    # @gatebluLogger = new GatebluLogService()
    # @gatebluLogger.addDeviceBegin @stateParams.gatebluUuid

  linkSubdeviceToGateblu: =>
    @updating = true
    @updateSubdevice().then =>
      @updateGatebluDevice().then =>
        @updating = false
        @done = true

  updateGatebluDevice: =>
    @gateblu.devices ?= []
    @gateblu.devices.push uuid: @device.uuid, type: @device.type, connector: @device.connector
    @ThingService.updateDevice @gateblu

  updateSubdevice: =>
    @ThingService.updateDevice @device

angular.module('octobluApp').controller 'LinkSubdeviceFormController', LinkSubdeviceFormController
