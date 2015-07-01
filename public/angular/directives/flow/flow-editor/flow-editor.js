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
        displayOnly: '=',
        renderViewBox: '='
      },

      link: function ($scope, element) {
        var flowRenderer = new FlowRenderer(element, {readonly: $scope.readonly, displayOnly: $scope.displayOnly});

        $scope.$on('centerViewBox', function(){
          console.log('centerViewBox');
          flowRenderer.centerViewBox();
        });

        $scope.$on("updateZoomScale", function(){
          flowRenderer.updateZoomScale($scope.flow.zoomScale);
        });

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {
            if (message.topic !== 'pulse') {
              return;
            }
            var element = Snap.select('#node-' + message.payload.node + ' > image');
            element.animate({
              width :FlowNodeDimensions.width * 1.2,
              height:FlowNodeDimensions.minHeight * 1.2
            }, 250, mina.easeout, function() {
              element.animate({
                width :FlowNodeDimensions.width,
                height:FlowNodeDimensions.minHeight
              }, 250, mina.easein);
            });
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
        //render($scope.flow);

        $scope.$watch('flow', function(newFlow, oldFlow) {

          console.log('checking render...');

          if (!newFlow || !(newFlow.nodes || newFlow.links)) {
            if (newFlow) {
              console.log('no flow info...?',newFlow.nodes,newFlow.links,newFlow);
            }
            return;
          }

          if (oldFlow) {
            var modFlow = {nodes:newFlow.nodes,links:newFlow.links};
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
        }, true);

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
