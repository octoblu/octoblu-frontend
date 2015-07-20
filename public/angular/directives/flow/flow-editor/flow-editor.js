angular.module('octobluApp')
  .directive('flowEditor', function (FlowRenderer, NodeTypeService, skynetService, CoordinatesService, FlowNodeDimensions, $interval, FlowService) {
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

        skynetService.getSkynetConnection().then(function (skynetConnection) {
          skynetConnection.on('message', function (message) {

            if (message.topic !== 'pulse') {
              return;
            }

            var nodeToPulse = Snap.select('#node-' + message.payload.node + ' > image');

            if(!nodeToPulse) {
              return;
            }

            nodeToPulse.animate({
              width :FlowNodeDimensions.width * 1.2,
              height:FlowNodeDimensions.minHeight * 1.2
            }, 250, mina.easeout, function() {
              nodeToPulse.animate({
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
          if (!$scope.flow) return;
          $scope.flow.selectedLink = null;
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

        $scope.addNode = function(data, event){
          var flowNodeType = data['json/flow-node-type'];
          var newLoc = CoordinatesService.transform(snap.node, event.clientX, event.clientY);
          flowNodeType.x = newLoc.x - (FlowNodeDimensions.width / 2);
          flowNodeType.y = newLoc.y - (FlowNodeDimensions.minHeight / 2);
          $scope.$emit('flow-node-type-selected', flowNodeType);
        };

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
