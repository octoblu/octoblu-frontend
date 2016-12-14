class ConfigureController
  constructor: ($scope, $state, $stateParams, $cookies, RegistryService, FlowNodeTypeService, NotifyService) ->
    @scope = $scope
    @state = $state
    @cookies = $cookies
    @FlowNodeTypeService = FlowNodeTypeService
    @NotifyService = NotifyService
    @RegistryService = RegistryService
    @scope.loadingConnectedThings = true
    @scope.noThings = false
    connectedThings = []
    @scope.registries = {}

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

    @RegistryService.getRegistries()
      .then (registries) =>
        @scope.registries = registries
      , (error) =>
        @NotifyService.notifyError(error)

    @scope.$watch 'filterByName', (filter='') =>
      filter = filter.toLowerCase()
      filteredDevices = _.filter connectedThings, ({name='', type='', uuid=''}) =>
        return true if _.contains name.toLowerCase(), filter
        return true if _.contains type.toLowerCase(), filter
        return true if _.contains uuid.toLowerCase(), filter
        return false

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
      return 'Flows' if device.type == 'octoblu:flow'
      return 'Flows' if device.type == 'device:flow'
      return 'Other' unless device.defaults.nodeType?.categories?
      return device.defaults.nodeType.categories
    @scope.categories = _.sortBy(_.keys @scope.connectedThingsByCategory)
    (_.pull @scope.categories, 'Flows').push 'Flows' if @scope.connectedThingsByCategory['Flows']

angular.module('octobluApp').controller 'ConfigureController', ConfigureController
