class NodeCollectionController
  constructor: ($scope) ->
    @scope = $scope

  addFlowNodeType: (flowNodeType) =>
    parent =
      centerHeight: document.getElementsByClassName('flow-editor')[0].offsetHeight/3
      centerWidth: document.getElementsByClassName('flow-editor')[0].offsetWidth/3

    flowNodeType.x = (@getRandomInt(parent.centerWidth, parent.centerWidth + 500) - @scope.flow.zoomX) / @scope.flow.zoomScale
    flowNodeType.y = (@getRandomInt(parent.centerHeight, parent.centerHeight + 500 - 60) - @scope.flow.zoomY) / @scope.flow.zoomScale

    @scope.$emit('flow-node-type-selected', flowNodeType)

  getRandomInt: (min, max) =>
    Math.floor(Math.random() * (max - min)) + min


angular.module('octobluApp').controller 'NodeCollectionController', NodeCollectionController
