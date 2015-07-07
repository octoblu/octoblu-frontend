class ConfigureController
  constructor: ($scope, $state, $stateParams, NodeService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @scope.loading = true
    @scope.noDevices = false
    devices = []

    NodeService.getNodes().then (newDevices) =>
      @scope.loading = false
      devices = newDevices
      @updateDevicesByCategory devices

    @scope.$watch 'deviceNameFilter', (deviceNameFilter) =>
      filteredDevices = _.filter devices, (device) =>
        name = (device.name || '').toLowerCase()
        return _.contains name, deviceNameFilter

      @updateDevicesByCategory(filteredDevices)

  updateDevicesByCategory: (devices) =>
    if devices.length
      @scope.noDevices = false
    if !devices.length
      @scope.noDevices = true
    @scope.devicesByCategory = _.groupBy devices, 'category'


angular.module('octobluApp').controller 'ConfigureController', ConfigureController
