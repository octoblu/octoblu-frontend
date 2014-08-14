angular.module('octobluApp')
.controller('FlowEditorController', function($scope, FlowNodeTypeService){
  'use strict';

  $scope.addNode = function(flowNodeType, x, y){
    var flowNode;

    flowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    flowNode.x = x / $scope.flow.zoomScale;
    flowNode.y = y / $scope.flow.zoomScale;

    $scope.flow.nodes.push(flowNode);
  };
});
