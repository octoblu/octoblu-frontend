class ConfigureController
  constructor: ($scope, $state, $stateParams, FlowNodeTypeService, NotifyService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @FlowNodeTypeService = FlowNodeTypeService
    @NotifyService = NotifyService
    @scope.loadingConnectedThings = true
    @scope.noThings = false
    connectedThings = []

    @NotifyService.notify "#{$stateParams.added} successfully added" if $stateParams.added
    @NotifyService.notify "#{$stateParams.deleted} successfully deleted" if $stateParams.deleted

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        connectedThings = _.filter flowNodeTypes, (node) =>
          node.category != 'operation'
        @scope.loadingConnectedThings = false
        @updateThingsByCategory connectedThings

    @scope.$watch 'deviceNameFilter', (deviceNameFilter) =>
      deviceNameFilter = deviceNameFilter || '';
      filteredDevices = _.filter connectedThings, (device) =>
        name = (device.name || device.type).toLowerCase()
        deviceNameFilter = deviceNameFilter.toLowerCase()
        return _.contains name, deviceNameFilter
      @updateThingsByCategory(filteredDevices)

  updateThingsByCategory: (things) =>
    if !things.length
      @scope.noThings = true
    if things.length
      @scope.noThings = false
    @scope.connectedThingsByCategory = _.groupBy things, (device) =>
      return "Flows" if device.type == 'device:flow'
      return "Other" unless device.defaults.nodeType.categories?
      device.defaults.nodeType.categories;


angular.module('octobluApp').controller 'ConfigureController', ConfigureController
