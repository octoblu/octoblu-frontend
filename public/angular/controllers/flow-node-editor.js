angular.module('octobluApp')
  .controller('flowNodeEditorController', function ($scope, FlowNodeTypeService) {
    'use strict';

    $scope.selectedNode = null;

    $scope.$watch('selectedNode', function(newFlowNode, oldFlowNode){
      if (!newFlowNode) {
        $scope.flowNodeType = null;
        return;
      }

      FlowNodeTypeService.getFlowNodeType(newFlowNode.type).then(function(flowNodeType){
        $scope.flowNodeType = flowNodeType;
      });
    });
});
