angular.module('octobluApp')
.controller('FlowNodeEditorController', function ($timeout, $scope, FlowService, FlowEditorService, FlowNodeTypeService) {
  'use strict';

  var setFlowNodeType = function() {
    $scope.showFlowNodeEditor = false;
    $scope.showHelp = false;
    if(!$scope.flowNode) {
      $scope.flowNodeType = null;
      return;
    }

    FlowNodeTypeService.getFlowNodeType($scope.flowNode.type).then(function(flowNodeType){
      $scope.flowNodeType = flowNodeType;
      $timeout(function(){
        $scope.showFlowNodeEditor = true;
      }, 200);
    });

    FlowNodeTypeService.getOtherMatchingFlowNodeTypes($scope.flowNode.type).then(function(otherMatchingFlowNodeTypes){
      $scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes;
    });
  };

  $scope.close = function(){
    $scope.flowNode = null;
  };


  $scope.deleteNode = function(flowNode, flow){
    flow.selectedFlowNode = flowNode
    FlowEditorService.deleteSelection(flow);
    FlowService.saveFlow(flow);
  };

  setFlowNodeType();
  $scope.$watch('flowNode', setFlowNodeType);
});
