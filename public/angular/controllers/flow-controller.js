angular.module('octobluApp')
  .controller('FlowController', function ($rootScope, $log, $modal, $state, $stateParams, $scope, $window, AuthService,  FlowService, FlowNodeTypeService, NodeTypeService) {
    var originalNode;

    $scope.zoomLevel = 0;
    $scope.debugLines = [];

    FlowNodeTypeService.getFlowNodeTypes()
      .then(function (flowNodeTypes) {
        $scope.flowNodeTypes = flowNodeTypes;
      });

    NodeTypeService.getNodeTypes()
      .then(function (nodeTypes) {
        $scope.nodeTypes = nodeTypes;
      });

    var refreshFlows = function () {
      return FlowService.getAllFlows()
        .then(function (flows) {
          $scope.flows = flows;
      });
    };

    refreshFlows().then(function(){
      var activeFlow = _.findWhere($scope.flows, {flowId: $stateParams.flowId});
      $scope.setActiveFlow(activeFlow);
    });

    $scope.logout = function(){
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });
    };

    $scope.$on('flow-node-debug', function (event, message) {
      $log.debug(message);
      $scope.debugLines.push(_.clone(message.message));
      if ($scope.debugLines.length > 100) {
        $scope.debugLines.shift();
      }
      $scope.$apply();
    });

    $scope.$on('flow-node-type-selected', function(event, flowNodeType){
      $scope.omniSearch = flowNodeType;
    });

    $scope.addFlow = function () {
      var name = 'Flow ' + ($scope.flows.length + 1);
      var newFlow = FlowService.newFlow({name: name});
      FlowService.saveFlow(newFlow).then(function(){
        $state.go('flow', {flowId: newFlow.flowId});
      });
    };

    $scope.getActiveFlow = function(){
      return FlowService.getActiveFlow();
    };

    $scope.setActiveFlow = function (flow) {
      $scope.activeFlow = flow;
      FlowService.setActiveFlow($scope.activeFlow);
    };

    $scope.isActiveFlow = function (flow) {
      return flow === $scope.activeFlow;
    };

    $scope.deleteFlow = function (flow) {
      var deleteFlowConfirmed = $window.confirm('Are you sure you want to delete ' + flow.name + '?');
      if (deleteFlowConfirmed) {
        FlowService.deleteFlow(flow.flowId).then(function () {
          refreshFlows();
        });
      }
    };

    $scope.copySelection = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow && $scope.activeFlow.selectedFlowNode) {
        $scope.copiedNode = JSON.stringify($scope.activeFlow.selectedFlowNode);
      }
    };

    $scope.cutSelection = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow) {
        $scope.copiedNode = JSON.stringify($scope.activeFlow.selectedFlowNode);
        _.pull($scope.activeFlow.nodes, $scope.activeFlow.selectedFlowNode);
      }

      if ($scope.activeFlow) {
        _.pull($scope.activeFlow.links, $scope.activeFlow.selectedLink);
      }

      $scope.activeFlow.selectedFlowNode = null;
      $scope.activeFlow.selectedLink = null;
    };

    $scope.immediateStart = function (e) {
      if (e) {
        e.preventDefault();
      }
      FlowService.start();
    };

    $scope.start = _.throttle($scope.immediateStart, 5000);

    $scope.immediateStop = function (e) {
      if (e) {
        e.preventDefault();
      }
      FlowService.stop();
    };

    $scope.stop = _.throttle($scope.immediateStop, 5000);

    $scope.deleteSelection = function (e) {
      if (e) {
        e.preventDefault();
      }

      if (!$scope.activeFlow) {
        return;
      }

      _.pull($scope.activeFlow.nodes, $scope.activeFlow.selectedFlowNode);
      _.pull($scope.activeFlow.links, $scope.activeFlow.selectedLink);

      $scope.activeFlow.selectedFlowNode = null;
      $scope.activeFlow.selectedLink = null;
    };

    $scope.pasteSelection = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow && $scope.copiedNode) {
        var node = JSON.parse($scope.copiedNode);
        if ($scope.currentMouseX) {
          node.x = $scope.currentMouseX;
        }
        if ($scope.currentMouseY) {
          node.y = $scope.currentMouseY;
        }
        $scope.activeFlow.addNode(node);
      }

      $scope.activeFlow.selectedFlowNode = null;
      $scope.activeFlow.selectedLink = null;
    };

    $scope.zoomIn = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow.zoomScale + 0.25 <= 2) {
        $scope.activeFlow.zoomScale += 0.25;
      }
    };

    $scope.zoomOut = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow.zoomScale - 0.25 >= 0.25) {
        $scope.activeFlow.zoomScale -= 0.25;
      }
    };

    $scope.immediateSave = function (e) {
      if (e) {
        e.preventDefault();
      }
      FlowService.saveActiveFlow();
    };


    $scope.save = _.throttle($scope.immediateSave, 1000);

    $scope.setMousePosition = function (e) {
      if (!$scope.activeFlow) {
        return;
      }
      $scope.currentMouseX = e.offsetX / $scope.activeFlow.zoomScale;
      $scope.currentMouseY = e.offsetY / $scope.activeFlow.zoomScale;
    };

    $scope.clearMousePosition = function () {
      $scope.currentMouseX = null;
      $scope.currentMouseY = null;
    };

    $scope.$watch('activeFlow', FlowService.debouncedSaveFlow, true);
  });
