class LinkSubdeviceFormController
  constructor: ($scope, $state, ThingService, NotifyService, MeshbluHttpService) ->
    @state = $state
    @ThingService = ThingService
    @NotifyService = NotifyService
    @MeshbluHttpService = MeshbluHttpService
    {@device, @gateblu, @nodeType} = $scope.subdeviceLink

    return @state.go 'material.nodewizard-linksubdevice.selectgateblu' unless @gateblu?
    return @state.go 'material.nodewizard-linksubdevice.selecttype' unless @nodeType?

  linkSubdeviceToGateblu: =>
    @updating = true
    @updateSubdevice()
      .then @updateGatebluDevice
      .then @finish

  finish: =>
    @NotifyService.notify "#{@device.name} successfully linked to #{@gateblu.name}"
    @state.go 'material.things.all'

  updateGatebluDevice: =>
    update =
      $addToSet:
        devices: [uuid: @device.uuid, type: @device.type, connector: @device.connector]

    @MeshbluHttpService.updateDangerously @gateblu.uuid, update

  updateSubdevice: =>
    propertiesToUpdate =
      uuid: @device.uuid
      category: @nodeType.category
      connector: @nodeType.connector
      logo: @nodeType.logo
      type: @nodeType.type
      gateblu: @gateblu.uuid
      configureWhitelist: _.union [@gateblu.uuid], @device.configureWhitelist
      discoverWhitelist: _.union [@gateblu.uuid], @device.discoverWhitelist
      sendAsWhitelist: _.union [@gateblu.uuid], @device.sendAsWhitelist
      receiveAsWhitelist: _.union [@gateblu.uuid], @device.receiveAsWhitelist

    @device = _.extend @device, propertiesToUpdate

    @ThingService.updateDevice propertiesToUpdate

angular.module('octobluApp').controller 'LinkSubdeviceFormController', LinkSubdeviceFormController
