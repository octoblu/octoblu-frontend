class ConfigureController
  constructor: ($scope, $state, $stateParams, NodeService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @scope.loading = true
    @scope.noDevices = false
    devices = []

    NodeService.getNodes().then (newDevices) =>
      @scope.loading = false
      console.log "BEFORE", newDevices
      devices = newDevices
      console.log "AFTER", devices
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
      @scope.noDevices = true
    if devices.length
      @scope.noDevices = false
    @scope.devicesByCategory = _.groupBy devices, (device) =>
      return "Flows" if device.type == 'device:flow'
      device.nodeType.categories;


angular.module('octobluApp').controller 'ConfigureController', ConfigureController
