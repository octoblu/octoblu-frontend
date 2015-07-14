class UtilityInspectorController
  constructor: ($scope, FlowNodeTypeService, NodeTypeService) ->
    @scope = $scope
    @scope.tab = {}
    @scope.nodes = {}
    @scope.collectionViewStyle = 'list'
    @scope.viewSource = false
    @scope.loading = true

    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService = NodeTypeService

    @toggleActiveTab 'things'

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        @scope.nodes.operators  = _.filter flowNodeTypes, category : 'operation'
        @scope.nodes.configured = _.filter flowNodeTypes, @flowNodeTypeIsConfiguredNode
        @scope.flowNodes        = _.filter flowNodeTypes, type: 'device:flow'
      .catch (error) =>
        console.error 'Error', error.message
        @scope.errorMessage = error.message

    @NodeTypeService.getUnconfiguredNodeTypes()
      .then (nodeTypes) =>
        @scope.loading = false
        @scope.nodes.available = _.groupBy nodeTypes, 'categories'

  toggleActiveTab: (tabState) =>
    if tabState in ['things', 'tools', 'debug']
      @scope.tab.state = tabState
      @scope.filterQuery = '' if tabState == 'debug'
    else
      @scope.tab.state = undefined

  setCollectionViewStyle: (viewStyle) =>
    @scope.collectionViewStyle = viewStyle

  flowNodeTypeIsConfiguredNode: (node) =>
    node.category != 'operation' && node.type != 'device:flow'

  toggleViewSource: =>
    @scope.viewSource = !@scope.viewSource

angular.module('octobluApp').controller 'UtilityInspectorController', UtilityInspectorController
