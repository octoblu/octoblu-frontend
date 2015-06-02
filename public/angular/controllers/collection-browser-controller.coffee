class CollectionBrowserController
  constructor: ($scope, FlowNodeTypeService, NodeTypeService) ->
    @scope = $scope
    @scope.tab = {}
    @scope.nodes = {}
    @scope.collectionViewStyle = 'list'
    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService = NodeTypeService

    @toggleActiveTab 'nodes'

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
        $scope.nodes.available = nodeTypes

  toggleActiveTab: (tabState) =>
    if tabState in ['nodes', 'flows', 'debug']
      @scope.tab.state = tabState
      @scope.filterQuery = ''
    else
      @scope.tab.state = undefined

  setCollectionViewStyle: (viewStyle) =>
    @scope.collectionViewStyle = viewStyle

  flowNodeTypeIsConfiguredNode: (node) =>
    node.category != 'operation' && node.type != 'device:flow'

angular.module('octobluApp').controller 'CollectionBrowserController', CollectionBrowserController
