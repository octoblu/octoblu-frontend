class NodeCollectionController
  constructor: ($scope) ->
    @scope = $scope

  addFlowNodeType: (flowNodeType) =>
    parent =
      centerHeight: document.getElementsByClassName('flow-editor')[0].offsetHeight/2
      centerWidth: document.getElementsByClassName('flow-editor')[0].offsetWidth/2

    flowNodeType.x = (@getRandomInt(500,1000) - @scope.flow.zoomX) / @scope.flow.zoomScale
    flowNodeType.y = (@getRandomInt(500,1000) - @scope.flow.zoomY) / @scope.flow.zoomScale

    @scope.$emit('flow-node-type-selected', flowNodeType)

  getRandomInt: (min, max) =>
    Math.floor(Math.random() * (max - min)) + min


angular.module('octobluApp').controller 'NodeCollectionController', NodeCollectionController
