
TABS =
  properties: 0
  permissions: 1

class DeviceDetailController

  constructor: ($scope, $stateParams, deviceService) ->
    @scope = $scope
    @scope.activeTabIndex = TABS[$stateParams.tab]

    deviceService.getDeviceByUUID($stateParams.uuid).then (device) =>
      $scope.device = device

    deviceService.getDevices().then (devices) =>
      $scope.devices = devices

angular.module 'octobluApp'
       .controller 'DeviceDetailController', DeviceDetailController
