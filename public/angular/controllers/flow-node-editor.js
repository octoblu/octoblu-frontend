angular.module('octobluApp')
  .controller('flowNodeEditorController', function ($scope, FlowNodeTypeService) {
    'use strict';

    $scope.schemaControl = {};

    $scope.$watch('flowEditor.selectedNode', function(newFlowNode, oldFlowNode){
      $scope.flowEditor.editorNode = _.clone($scope.flowEditor.selectedNode);

      if (!newFlowNode) {
        $scope.flowEditor.flowNodeType = null;
        return;
      }

      $scope.flowEditor.flowNodeType = newFlowNode;
    });

    $scope.updateNode = function(){
      _.extend($scope.flowEditor.selectedNode, $scope.flowEditor.editorNode);
      $scope.flowEditor.selectedNode = null;
    };
});
