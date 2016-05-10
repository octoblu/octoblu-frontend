class ConfigureController
  constructor: ($scope, $state, $stateParams, $cookies, FlowNodeTypeService, NotifyService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @state = $state
    @cookies = $cookies
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @FlowNodeTypeService = FlowNodeTypeService
    @NotifyService = NotifyService
    @scope.loadingConnectedThings = true
    @scope.noThings = false
    connectedThings = []

    @NotifyService.notify "#{$stateParams.added} successfully added" if $stateParams.added
    @NotifyService.notify "#{$stateParams.deleted} successfully deleted" if $stateParams.deleted

    @checkRedirectToFlowConfigure()

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        connectedThings = _.filter flowNodeTypes, (node) =>
          return unless node.uuid
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

  checkRedirectToFlowConfigure: () =>
    return unless localStorage.getItem 'redirectFlowConfig'
    params =
      flowId: localStorage.getItem 'wizardFlowId'
      nodeIndex: localStorage.getItem 'wizardNodeIndex'

    @removeRedirectUriConfig()
    @state.go 'material.flowConfigure', params

  removeRedirectUriConfig: () =>
    localStorage.removeItem 'wizardFlowId'
    localStorage.removeItem 'wizardNodeIndex'
    localStorage.removeItem 'redirectFlowConfig'

  updateThingsByCategory: (things) =>
    @scope.noThings = things.length == 0
    @scope.connectedThingsByCategory = _.groupBy things, (device) =>
      return "Flows" if device.type == 'device:flow'
      return "Other" unless device.defaults.nodeType.categories?
      device.defaults.nodeType.categories;
    @scope.categories = _.sortBy(_.keys @scope.connectedThingsByCategory)
    (_.pull @scope.categories, 'Flows').push 'Flows' if @scope.connectedThingsByCategory['Flows']

angular.module('octobluApp').controller 'ConfigureController', ConfigureController
