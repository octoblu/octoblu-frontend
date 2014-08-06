angular.module('octobluApp')
.controller('FlowEditorController', function($scope, FlowNodeTypeService){
  'use strict';

  $scope.addNode = function(flowNodeType, x, y){
    var flowNode;

    console.log(flowNodeType);
    flowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    flowNode.x = x;
    flowNode.y = y;
    console.log(flowNode);

    $scope.flow.nodes.push(flowNode);
  };
});
