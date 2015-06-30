angular.module('octobluApp')
  .directive('flowEditor', function (FlowRenderer, NodeTypeService, skynetService, FlowNodeDimensions, $interval) {
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
        var flowRenderer = new FlowRenderer(element, {readonly: $scope.readonly, displayOnly: $scope.displayOnly});
        
        $scope.$watch("flow.zoomScale", function(newZoomScale, oldZoomScale){
          if(!newZoomScale) {
            return;
          }
          flowRenderer.updateZoomScale(newZoomScale);
        });

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {
            if (message.topic !== 'pulse') {
              return;
            }
            var element = d3.select('#node-' + message.payload.node + ' > image');
            element.transition()
              .attr('width', FlowNodeDimensions.width * 1.2)
              .attr('height', FlowNodeDimensions.minHeight * 1.2)
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

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {
            if (message.topic !== 'device-status') {
              return;
            }
            if($scope.flow){
              flowRenderer.render($scope.flow);
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

        function render(newFlow, oldFlow) {
          if (!newFlow) {
            return;
          }

          if (oldFlow) {
            var modFlow = _.clone(newFlow);
            delete modFlow.zoomX;
            delete modFlow.zoomY;
            delete modFlow.zoomScale;
            delete modFlow.selectedLink;
            delete modFlow.selectedFlowNode;
            delete modFlow.$$hashKey;
            delete modFlow.hash;

            var flowDiff = _.pick(modFlow,function(value,key){
              return !_.isEqual(value,oldFlow[key]);
            });
            if (_.size(flowDiff)==0) {
              //console.log('aborting, no diff!');
              return;
            }
            console.log('flow diff:',flowDiff);
          }

          //console.log(newFlow);
          flowRenderer.render(newFlow);
        }

        $scope.$watch('flow', render, true);

        $scope.$watch('flow.selectedFlowNode', function(){
          if(!$scope.flow || !$scope.flow.selectedFlowNode) { return; }

          //flowRenderer.centerOnSelectedFlowNode($scope.flow);
        });

        // element.on(
        //   'dragover',
        //   function (e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //   });
        //
        // element.on(
        //   'dragenter',
        //   function (e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //   });
      }
    };
  });
