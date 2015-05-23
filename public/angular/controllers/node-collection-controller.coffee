class NodeCollectionController
  constructor: ($scope, FlowNodeTypeService, NodeService) ->
    @scope = $scope
    @FlowNodeTypeService = FlowNodeTypeService

  getFlowNodeTypes:()  =>
    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        @scope.flowNodeTypes = flowNodeTypes
      .catch (error) =>
        @scope.errorMessage = error.message

  getConfiguredNodes:() =>
    return

  getAvailableNodes:() =>
    return


angular.module('octobluApp').controller 'NodeCollectionController', NodeCollectionController
