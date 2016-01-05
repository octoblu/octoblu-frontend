class LinkSubdeviceFormController
  constructor: ($scope, $stateParams, ThingService, GatebluService, GatebluLogService) ->
    {@device, @gateblu} = $scope.subdeviceLink
    @GatebluService = GatebluService
    @ThingService = ThingService
    # @gatebluLogger = new GatebluLogService()
    @updating = true
    @loading = true
    @done = false
    # @gatebluLogger.addDeviceBegin @stateParams.gatebluUuid    

  linkSubdeviceToGateblu: =>
    @updateSubdevice().then =>
      @updateGatebluDevice().then =>
        console.log 'Done linking!'

  updateGatebluDevice: =>
    @gateblu.devices ?= []
    @gateblu.devices.push uuid: @device.uuid, type: @device.type, connector: @device.connector
    @ThingService.updateDevice @gateblu

  updateSubdevice: =>
    @ThingService.updateDevice @device

angular.module('octobluApp').controller 'LinkSubdeviceFormController', LinkSubdeviceFormController
