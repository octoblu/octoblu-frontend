angular.module('octobluApp')
  .directive('flowEditor', function (FlowRenderer, NodeTypeService, CoordinatesService, FlowNodeDimensions, $interval, FlowService, MeshbluHttpService) {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: '/angular/directives/flow/flow-editor/flow-editor.html',
      replace: true,
      scope: {
        flow: '=',
        readonly: '=',
        displayOnly: '=',
        renderViewBox: '='
      },



      link: function ($scope, element) {
        var snap = Snap(element.find(".flow-editor-workspace")[0]);
        var flowRenderer = new FlowRenderer(snap, {readonly: ($scope.readonly||$scope.displayOnly)});
        var pulseNodeById = function(nodeId) {
          var nodesToPulse = Snap.selectAll('#node-' + nodeId + ' > image');

          _.each(nodesToPulse, function(nodeToPulse) {
            var bbox = nodeToPulse.getBBox();
            if (!_.isEmpty(nodeToPulse.inAnim())) {
              return;
            }
            nodeToPulse.animate({
              width : bbox.width * 1.2,
              height: bbox.height * 1.2
            }, 250, mina.easeout, function() {
              nodeToPulse.animate({
                width : bbox.width,
                height: bbox.height
              }, 250, mina.easein);
            });
          });
        };

        var debugErrorEmitter = function(payload) {
          if ($scope.flow) {
            var debugNode = _.find($scope.flow.nodes, { id: payload.node });
            if (debugNode && debugNode.debug) {
              $scope.$emit('flow-node-debug', {node: debugNode, message: payload})
            }
            if (payload.msgType == 'error') {
              $scope.$emit('flow-node-error', {node: debugNode, message: payload})
            }
          }
        }

        flowRenderer.on('nodeSelected', function (flowNode) {
          if (!$scope.flow) return;
          $scope.flow.selectedLink = null;
          $scope.flow.selectedFlowNode = null;
          $scope.$apply();
          $scope.flow.selectedFlowNode = flowNode;
          $scope.$apply();
        });

        flowRenderer.on('linkSelected', function (flowLink) {
          if (!$scope.flow) return;
          $scope.flow.selectedFlowNode = null;
          $scope.flow.selectedLink = flowLink;
          $scope.$apply();
        });

        flowRenderer.on('flowChanged', function (newFlow) {;
          $scope.$apply();
        });

        flowRenderer.on('nodeButtonClicked', function (flowNode) {
          var msg = {
            devices: [$scope.flow.flowId],
            topic: 'button',
            qos: 0,
            payload: {
              from: flowNode.id
            }
          };
          MeshbluHttpService.message(msg, _.noop);
        });

        $scope.addNode = function(data, event){
          var flowNodeType = data['json/flow-node-type'];
          if (!flowNodeType) {
            console.error("addNode didn't get a flow-node-type!")
            return;
          }
          var newLoc = CoordinatesService.transform(snap.node, event.clientX, event.clientY);
          flowNodeType.x = newLoc.x - (FlowNodeDimensions.width / 2);
          flowNodeType.y = newLoc.y - (FlowNodeDimensions.minHeight / 2);
          $scope.$emit('flow-node-type-selected', flowNodeType);
        };

        $scope.$on('flow-node-pulse', function (event, message) {
          if (message.payload) {
            pulseNodeById(message.payload.node)
          }
        });

        $scope.$on('flow-node-batch-debug', function(event, message) {
          if (message.payload) {
            debugErrorEmitter(message.payload)
          }
        });

        $scope.$watch('flow', function(newFlow, oldFlow) {
          flowRenderer.render(newFlow);
        }, true);

        $scope.$watch('flow.selectedFlowNode', function(){
          _.each(snap.selectAll(".selected"),function(selected){
            selected.toggleClass('selected',false);
          });
          if(!$scope.flow || !$scope.flow.selectedFlowNode) { return; }
          var nodeElement = snap.select("#node-"+$scope.flow.selectedFlowNode.id);
          if (nodeElement) {
            nodeElement.toggleClass('selected',true);
          }
        });

        $scope.$on('zoomIn', function(){
          flowRenderer.zoomIn();
        });

        $scope.$on('zoomOut', function(){
          flowRenderer.zoomOut();
        });

        $scope.$on('centerViewBox', function(){
          flowRenderer.centerViewBox();
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
