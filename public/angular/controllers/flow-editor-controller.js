angular.module('octobluApp')
.controller('FlowEditorController', function($scope, FlowNodeTypeService){
  'use strict';

  $scope.addNode = function(flowNodeType){
    var flowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    $scope.flow.nodes.push(flowNode);
  };
});
