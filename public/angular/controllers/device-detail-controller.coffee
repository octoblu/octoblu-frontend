
TABS =
  properties: 0
  permissions: 1

class DeviceDetailController
  constructor: ($scope, $state, $stateParams, deviceService, ThingService) ->
    @state = $state
    @activeTabIndex = TABS[$stateParams.tab]
    @ThingService = ThingService

    deviceService.getDeviceByUUID($stateParams.uuid).then (device) =>
      @device = device
      console.log 'set @device', @device

    @ThingService.getThings().then (devices) =>
      @devices = devices

    $scope.$watch 'controller.device',  @updatePermissions
    $scope.$watch 'controller.permissions', @updateDevice

  onTabSelection: (tabName) =>
    return unless @device?
    @state.go 'material.newDeviceTab', {uuid: @device.uuid, tab: tabName}, notify: false

  updatePermissions: =>
    @permissions = @ThingService.mapWhitelistsToPermissions @device

  updateDevice: =>
    # ThingService.updateDeviceWithPermissions @device, @permissions

angular.module 'octobluApp'
       .controller 'DeviceDetailController', DeviceDetailController
