
class DeviceDetailController
  @TABS:
    properties: 0
    permissions: 1

  constructor: ($scope, $state, $stateParams, deviceService, ThingService) ->
    @state = $state
    @activeTabIndex = DeviceDetailController.TABS[$stateParams.tab]
    @ThingService = ThingService

    deviceService.getDeviceByUUID($stateParams.uuid).then (device) =>
      @device = device

    @ThingService.getThings().then (devices) =>
      @devices = devices

    $scope.$watch 'controller.device',  @updatePermissions, true
    $scope.$watch 'controller.permissions', @updateDevice, true

  onTabSelection: (tabName) =>
    return unless @device?
    @state.go 'material.newDeviceTab', {uuid: @device.uuid, tab: tabName}, notify: false

  updatePermissions: =>
    @permissions = @ThingService.mapWhitelistsToPermissions @device

  updateDevice: =>
    return unless @permissions?
    @ThingService.updateDeviceWithPermissions @device, @permissions

angular.module 'octobluApp'
       .controller 'DeviceDetailController', DeviceDetailController
