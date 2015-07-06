angular.module('octobluApp')
.controller('FlowEditorController', function(OCTOBLU_API_URL, $scope, FlowNodeTypeService){
  'use strict';

  $scope.addNode = function(flowNodeType, x, y){
    var flowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    console.log('snap:',$scope.snap);
    var newLoc = $scope.snap.transformCoords(x,y);
    flowNode.x = newLoc.x;
    flowNode.y = newLoc.y;
    $scope.flow.nodes.push(flowNode);
  };
});
