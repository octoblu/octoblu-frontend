angular.module('octobluApp')
  .directive('flowEditor', function (FlowRenderer, NodeTypeService, skynetService, FlowNodeDimensions) {

    return {
      restrict: 'E',
      controller: 'FlowEditorController',
      templateUrl: '/angular/directives/flow/flow-editor/flow-editor.html',
      replace: true,
      scope: {
        flow: '=',
        readonly: '=',
        displayOnly: '='
      },

      link: function ($scope, element) {
        $scope.grid = 'blue-grid';
        var renderScope = d3
          .select(element.find('.flow-editor-render-area')[0]);

        var flowRenderer = new FlowRenderer(renderScope, {readonly: $scope.readonly, displayOnly: $scope.displayOnly});

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {
            if (message.topic !== 'pulse') {
              return;
            }
            var element = d3.select('#node-' + message.payload.node + ' > image');
            element.transition()
              .attr('width', FlowNodeDimensions.width * 1.1)
              .attr('height', FlowNodeDimensions.minHeight * 1.1)
              .duration(250);

            element.transition()
              .delay(250)
              .attr('width', FlowNodeDimensions.width)
              .attr('height', FlowNodeDimensions.minHeight)
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
                $scope.$emit('flow-node-debug', {node: debugNode, message: message.payload})
              }
              if (message.payload.msgType == 'error') {
                $scope.$emit('flow-node-error', {node: debugNode, message: message.payload})
              }
            }
          });
        });

        flowRenderer.on('nodeSelected', function (flowNode) {
          $scope.flow.selectedLink = null;
          $scope.flow.selectedFlowNode = flowNode;

          if(flowNode && flowNode.needsSetup){
            NodeTypeService.getNodeTypeByType(flowNode.type).then(function(flowNodeType){
              $scope.$emit('flow-node-type-selected', flowNodeType);
            });
          }

          $scope.$apply();
        });

        flowRenderer.on('linkSelected', function (flowLink) {
          $scope.flow.selectedFlowNode = null;
          $scope.flow.selectedLink = flowLink;
          $scope.$apply();
        });

        flowRenderer.on('flowChanged', function (newFlow) {;
          $scope.$apply();
        });

        flowRenderer.on('nodeButtonClicked', function (flowNode) {
          skynetService.getSkynetConnection().then(function (skynetConnection) {
            var msg = {
              devices: [$scope.flow.flowId],
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
          if (!newFlow) {
            return;
          }
            if (oldFlow && (newFlow.flowId !== oldFlow.flowId)) {
              skynetService.getSkynetConnection().then(function (skynetConnection) {
                skynetConnection.unsubscribe({uuid: oldFlow.flowId, type: 'octoblu:flow', topic: 'pulse'});
              });
            }

            flowRenderer.render(newFlow);
        }, true);

        $scope.$watch('flow.selectedFlowNode', function(){
          if(!$scope.flow || !$scope.flow.selectedFlowNode) { return; }

          //flowRenderer.centerOnSelectedFlowNode($scope.flow);
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
