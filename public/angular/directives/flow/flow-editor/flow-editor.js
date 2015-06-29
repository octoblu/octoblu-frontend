angular.module('octobluApp')
  .directive('flowEditor', function (FlowRenderer, NodeTypeService, skynetService, FlowNodeDimensions, $interval) {
    var VIEWBOX_X = 0, VIEWBOX_Y=0, VIEWBOX_WIDTH=1000, VIEWBOX_HEIGHT=1000;
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
        var svgElement = element.find('svg')[0];
        setupDragBehavior(svgElement);

        $scope.$watch("flow.zoomScale", function(newZoomScale, oldZoomScale){
          if(!newZoomScale) {
            return;
          }
          updateZoomScale(newZoomScale);
        });

        function updateZoomScale(newZoomScale) {
          var w = VIEWBOX_WIDTH / newZoomScale;
          var h = VIEWBOX_HEIGHT / newZoomScale;
          var x = VIEWBOX_X -  ((w - VIEWBOX_WIDTH)/2);
          var y = VIEWBOX_Y -  ((h- VIEWBOX_HEIGHT)/2);
          updateViewBox(x,y,w,h);
        }

        function updateViewBox(x,y,w,h) {
            svgElement.setAttribute('viewBox', [x, y, w, h].join(' '));
        }

        function getSvgCoords(x, y, svg) {
          var transformPoint = svg.createSVGPoint();
          transformPoint.x = x;
          transformPoint.y = y;
          transformPoint = transformPoint.matrixTransform(svg.getScreenCTM().inverse());
          return {x: transformPoint.x, y: transformPoint.y};
        }

        function setupDragBehavior(dragElement) {
          dragElement.addEventListener('dragstart', function(event){
            var startViewboxX = VIEWBOX_X;
            var startViewboxY = VIEWBOX_Y;
            var originalX = event.clientX;
            var originalY = event.clientY;
            event.preventDefault();

            function dragging(event){
              var startPos    = getSvgCoords(originalX, originalY, dragElement);
              var currentPos  = getSvgCoords(event.clientX, event.clientY, dragElement);
              var differenceX = currentPos.x - startPos.x;
              var differenceY = currentPos.y - startPos.y;
              VIEWBOX_X = (startViewboxX - differenceX);
              VIEWBOX_Y = startViewboxY - differenceY;
              updateZoomScale($scope.flow.zoomScale);
            }

            function dropped(event) {
              dragElement.removeEventListener('mousemove', dragging);
              dragElement.removeEventListener('mouseup', dropped);
            }

            dragElement.addEventListener('mousemove', dragging);
            dragElement.addEventListener('mouseup', dropped);
          });
        }

        var flowRenderer = new FlowRenderer(element, {readonly: $scope.readonly, displayOnly: $scope.displayOnly});

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

        $scope.$watch('flow', function (newFlow, oldFlow) {
          if (!newFlow) {
            return;
          }
          
          var modFlow = oldFlow;
          if (oldFlow) {
            modFlow = _.cloneDeep(newFlow);
            delete modFlow.zoomX;
            delete modFlow.zoomY;
            delete modFlow.zoomScale;
            delete oldFlow.zoomX;
            delete oldFlow.zoomY;
            delete oldFlow.zoomScale;
          }
          if (_.isEqual(modFlow, oldFlow)) {
            return;
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
