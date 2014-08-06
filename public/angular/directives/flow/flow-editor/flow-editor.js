angular.module('octobluApp')
  .directive('flowEditor', function (FlowRenderer) {
    return {
      restrict: 'E',
      controller: 'FlowEditorController',
      templateUrl: 'angular/directives/flow/flow-editor/flow-editor.html',
      replace: true,
      scope: {
        flow: '=',
        selectedNode: '='
      },

      link: function ($scope, element) {
        var renderScope = d3.select(element.find('svg')[0]);
        var flowRenderer = new FlowRenderer(renderScope);
        $scope.$watch('flow.flowId', function (newFlowId, oldFlowId) {

          if (newFlowId !== oldFlowId) {
            flowRenderer.render($scope.flow);
            flowRenderer.on('nodeSelected', function (flowNode) {
              $scope.selectedNode = flowNode;
              $scope.$apply();
            });
          }
        });

        element.on(
          'dragover',
          function (e) {
            e.preventDefault();
            e.stopPropagation();
          });

        element.on(
          'dragenter',
          function (e) {
            e.preventDefault();
            e.stopPropagation();
          });
      }
    };
  });
