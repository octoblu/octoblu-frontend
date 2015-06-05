class NodeCollectionController
  constructor: ($scope) ->
    @scope = $scope

  addFlowNodeType: (flowNodeType) =>
    @scope.$emit('flow-node-type-selected', flowNodeType);

angular.module('octobluApp').controller 'NodeCollectionController', NodeCollectionController
