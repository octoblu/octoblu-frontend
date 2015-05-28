class CollectionBrowserController
  constructor: ($scope, FlowNodeTypeService) ->
    @scope = $scope
    @scope.tab = {}
    @FlowNodeTypeService = FlowNodeTypeService
    @toggleActiveTab 'nodes'

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        @scope.operatorNodes   = _.filter flowNodeTypes, category : 'operation'
        @scope.configuredNodes = _.filter flowNodeTypes, @flowNodeTypeIsConfiguredNode
        @scope.flowNodes       = _.filter flowNodeTypes, type: 'device:flow'

      .catch (error) =>
        console.error 'Error', error.message
        @scope.errorMessage = error.message


  toggleActiveTab: (tabState) =>
    @scope.tab.state =
      if tabState in ['nodes', 'flows', 'debug']
        tabState
      else
        undefined

  flowNodeTypeIsConfiguredNode: (node) =>
    node.category != 'operation' && node.type != 'device:flow'


angular.module('octobluApp').controller 'CollectionBrowserController', CollectionBrowserController
