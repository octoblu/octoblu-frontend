class NodeCollectionController
  constructor: ($scope) ->
    @scope = $scope

  addFlowNodeType: (flowNodeType) =>
    parent =
      centerHeight: document.getElementsByClassName('flow-editor')[0].offsetHeight/3
      centerWidth: document.getElementsByClassName('flow-editor')[0].offsetWidth/3

    @scope.$emit('flow-node-type-selected', flowNodeType)


angular.module('octobluApp').controller 'NodeCollectionController', NodeCollectionController
