angular.module('octobluApp')
  .controller('flowNodeEditorController', function ($scope, FlowNodeTypeService) {
    'use strict';

    $scope.$watch('flowEditor.selectedNode', function(newFlowNode, oldFlowNode){
      if (!newFlowNode) {
        $scope.flowEditor.flowNodeType = null;
        return;
      }

      FlowNodeTypeService.getFlowNodeType(newFlowNode.type).then(function(flowNodeType){
        $scope.flowEditor.flowNodeType = flowNodeType;
      });
    });
});
