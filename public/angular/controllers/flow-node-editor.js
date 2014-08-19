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
      console.log(JSON.stringify($scope.flowEditor.editorNode.params));
      console.log(JSON.stringify($scope.flowEditor.selectedNode.params));
      $scope.flowEditor.selectedNode = null;
    };
});
