angular.module('octobluApp')
  .directive('flowEditor', function ($log, FlowRenderer, skynetService) {

    return {
      restrict: 'E',
      controller: 'FlowEditorController',
      templateUrl: 'angular/directives/flow/flow-editor/flow-editor.html',
      replace: true,
      scope: {
        flow: '=',
        selectedNode: '=',
        selectedLink: '='
      },

      link: function ($scope, element) {
        var renderScope = d3.select(element.find('svg')[0]);
        var flowRenderer = new FlowRenderer(renderScope);

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {
            if (message.topic !== 'pulse') {
              return;
            }

            var element = d3.select('#node-' + message.payload.node + ' > rect');
            element.transition()
              .style('stroke-width', 3)
              .style('stroke', '#000')
              .duration(250);

            element.transition()
              .delay(250)
              .style('stroke-width', 2)
              .style('stroke', '#999')
              .duration(250);
          });
        });

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {
            if (message.topic !== 'debug') {
              return;
            }

              if ($scope.flow) {
                  var debugNode = _.findWhere($scope.flow.nodes, { id: message.payload.node });
                  if (debugNode && debugNode.debug) {
                      $log.log(message.payload);
                  }
              }
          });
        });

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

        $scope.$watch('flow', function (newFlow) {

          if (newFlow) {
            skynetService.getSkynetConnection().then(function (skynetConnection) {
              skynetConnection.subscribe({uuid: newFlow.flowId, type: 'octoblu:flow', topic: 'pulse'});
            });

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
