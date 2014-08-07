angular.module('octobluApp')
.controller('FlowEditorController', function($scope, FlowNodeTypeService){
  'use strict';

  $scope.addNode = function(flowNodeType, x, y){
    var flowNode;

    flowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    flowNode.x = x;
    flowNode.y = y;

    $scope.flow.nodes.push(flowNode);
  };
});
