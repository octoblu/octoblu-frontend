angular.module('octobluApp')
.controller('FlowNodeEditorController', function ($scope, FlowNodeTypeService, marked) {
  'use strict';

  var setFlowNodeType = function() {
    if(!$scope.flowNode) {
      $scope.flowNodeType = null;
      return;
    }

    FlowNodeTypeService.getFlowNodeType($scope.flowNode.type).then(function(flowNodeType){
      $scope.flowNodeType = flowNodeType;
      $scope.formTemplatePath = $scope.flowNodeType.formTemplatePath; //causes fadeOut to be smoother
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

  setFlowNodeType();
  $scope.$watch('flowNode', setFlowNodeType);
});
