angular.module('octobluApp')
  .directive('flowEditor', function ($log, FlowRenderer, skynetService) {

    return {
      restrict: 'E',
      controller: 'FlowEditorController',
      templateUrl: '/angular/directives/flow/flow-editor/flow-editor.html',
      replace: true,
      scope: {
        flow: '='
      },

      link: function ($scope, element) {
        var renderScope = d3
          .select(element.find('.flow-editor-render-area')[0]);

        var flowRenderer = new FlowRenderer(renderScope);

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {
            if (message.topic !== 'pulse') {
              return;
            }

            var element = d3.select('#node-' + message.payload.node + ' > rect');
            element.transition()
              .style('stroke-width', 4)
              .duration(250);

            element.transition()
              .delay(250)
              .style('stroke-width', 2)
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
          $scope.flow.selectedLink = null;
          $scope.flow.selectedFlowNode = flowNode;
          $scope.$apply();
        });

        flowRenderer.on('linkSelected', function (flowLink) {
          $scope.flow.selectedFlowNode = null;
          $scope.flow.selectedLink = flowLink;
          $scope.$apply();
        });

        flowRenderer.on('flowChanged', function(newFlow){
          $scope.$apply();
        });

        flowRenderer.on('nodeButtonClicked', function(flowNode) {
          skynetService.getSkynetConnection().then(function (skynetConnection) {
            var msg = {
              devices: $scope.flow.flowId,
              topic: 'button',
              qos: 0,
              payload: {
                from: flowNode.id
              }
            };
            skynetConnection.message(msg);
          });
        });

        flowRenderer.renderGrid();

        $scope.$watch('flow', function (newFlow, oldFlow) {
          if (newFlow && newFlow !== oldFlow) {
            skynetService.getSkynetConnection().then(function (skynetConnection) {
              skynetConnection.subscribe({uuid: newFlow.flowId, type: 'octoblu:flow', topic: 'pulse'});
            });


            flowRenderer.render(newFlow);
          }
        }, true);

        $scope.$watch('flow.selectedFlowNode', function(){
          if(!$scope.flow || !$scope.flow.selectedFlowNode) { return; }

          flowRenderer.centerOnSelectedFlowNode($scope.flow);
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
