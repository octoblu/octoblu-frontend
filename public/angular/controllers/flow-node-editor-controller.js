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

    console.log('flowNode[key:val]', $scope.flowNode.composeKeys, $scope.flowNode.composeValues);

  };

  $scope.close = function(){
    $scope.flowNode = null;
  };


  $scope.deleteNode = function(){
    var activeFlow = FlowService.getActiveFlow();
    activeFlow = FlowEditorService.deleteSelection(activeFlow);
    FlowService.saveActiveFlow(activeFlow);
  };

  setFlowNodeType();
  $scope.$watch('flowNode', setFlowNodeType);
});
