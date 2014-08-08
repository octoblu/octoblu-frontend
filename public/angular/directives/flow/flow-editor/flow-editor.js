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
        flowRenderer.on('nodeSelected', function (flowNode) {
          $scope.selectedLink = null;
          $scope.selectedNode = flowNode;
          $scope.$apply();
        });

        flowRenderer.on('linkSelected', function (flowLink) {
          $scope.selectedNode = null;
          $scope.selectedLink = flowLink;
          $scope.$apply();
        });

        $scope.$watch('flow', function (newFlow, oldFlow) {
          window.flow = newFlow;
          if (newFlow) {
            flowRenderer.render(newFlow);
          }
        }, true);

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
