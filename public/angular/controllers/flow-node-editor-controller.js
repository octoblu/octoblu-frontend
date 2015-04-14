angular.module('octobluApp')
.controller('FlowNodeEditorController', function ($scope, FlowService, FlowEditorService, FlowNodeTypeService) {
  'use strict';

  var setFlowNodeType = function() {
    if(!$scope.flowNode) {
      $scope.flowNodeType = null;
      return;
    }

    FlowNodeTypeService.getFlowNodeType($scope.flowNode.type).then(function(flowNodeType){
      $scope.flowNodeType = flowNodeType;
    });

    FlowNodeTypeService.getOtherMatchingFlowNodeTypes($scope.flowNode.type).then(function(otherMatchingFlowNodeTypes){
      $scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes;
    });
  };

  $scope.close = function(){
    $scope.flowNode = null;
  };

  $scope.toggleHelp = function(){
    $scope.showHelp = !$scope.showHelp;
  };

  $scope.deleteNode = function(){
    var activeFlow = FlowService.getActiveFlow();
    activeFlow = FlowEditorService.deleteSelection(activeFlow);
    FlowService.saveActiveFlow(activeFlow);
  };

  setFlowNodeType();
  $scope.$watch('flowNode', setFlowNodeType);
});
