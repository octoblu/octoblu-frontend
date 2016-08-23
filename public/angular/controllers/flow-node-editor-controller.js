angular.module('octobluApp')
.controller('FlowNodeEditorController', function ($timeout, $scope, FlowService, FlowEditorService, FlowNodeTypeService, CLUSTER_DOMAIN) {
  'use strict';
  $scope.clusterDomain = CLUSTER_DOMAIN
  var setFlowNodeType = function() {
    $scope.showFlowNodeEditor = false;
    $scope.showHelp = false;
    if(!$scope.flowNode) {
      $scope.flowNodeType = null;
      return;
    }

    if(!$scope.flowNode.staticMessage){
      $scope.flowNode.staticMessage = {}
    }

    FlowNodeTypeService.getFlowNodeType($scope.flowNode.type).then(function(flowNodeType){
      $scope.flowNodeType = flowNodeType;
      $timeout(function(){
        $scope.showFlowNodeEditor = true;
      }, 200);
    });

    FlowNodeTypeService.getOtherMatchingFlowNodeTypes($scope.flowNode.type).then(function(otherMatchingFlowNodeTypes){
      $scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes;
      $scope.showAvailableThings = _.size(otherMatchingFlowNodeTypes) > 1;
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
