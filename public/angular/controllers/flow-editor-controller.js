angular.module('octobluApp')
.controller('FlowEditorController', function($scope, FlowNodeTypeService){
  'use strict';

  $scope.addNode = function(flowNodeType, x, y){
    var flowNode;

    flowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    flowNode.x = x / $scope.getScaleFactor();
    flowNode.y = y / $scope.getScaleFactor();

    $scope.flow.nodes.push(flowNode);
  };

  $scope.getScaleFactor = function() {
    var scaleFactor = 1 + ($scope.zoomLevel * 0.25);

    if(scaleFactor > 2.5) {
      return 2.5;
    }
    if(scaleFactor <= 0) {
      return 0.25;
    }

    return scaleFactor;
  };
});
