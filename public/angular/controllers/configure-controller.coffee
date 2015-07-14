class ConfigureController
  constructor: ($scope, $state, $stateParams, NodeService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @scope.loading = true
    @scope.noThings = false
    devices = []

    NodeService.getNodes().then (newDevices) =>
      @scope.loading = false
      devices = newDevices
      @updateDevicesByCategory devices

    @scope.$watch 'deviceNameFilter', (deviceNameFilter) =>
      deviceNameFilter = deviceNameFilter || '';
      filteredDevices = _.filter devices, (device) =>
        name = (device.name || '').toLowerCase()
        deviceNameFilter = deviceNameFilter.toLowerCase();
        return _.contains name, deviceNameFilter

      @updateDevicesByCategory(filteredDevices)

  updateDevicesByCategory: (devices) =>
    if !devices.length
      @scope.noThings = true
    if devices.length
      @scope.noThings = false
    @scope.devicesByCategory = _.groupBy devices, (device) =>
      return "Flows" if device.type == 'device:flow'
      return "Other" unless device.nodeType.categories?
      device.nodeType.categories;


angular.module('octobluApp').controller 'ConfigureController', ConfigureController
