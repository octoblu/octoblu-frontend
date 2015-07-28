angular.module('octobluApp')
.directive('flowNodeEditor', function ($window) {
  return {
    restrict: 'E',
    controller: 'FlowNodeEditorController',
    templateUrl: '/pages/flow-node-editor.html',
    replace: true,
    scope: {
      flowNode: '=',
      flowId: '='
    }
  }
});
