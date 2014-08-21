angular.module('octobluApp')
  .controller('FlowController', function ($modal, $scope, $window, FlowService, FlowNodeTypeService) {
    var originalNode;
    $scope.zoomLevel = 0;

    $scope.flowEditor = {
      selectedNode: null
    };

    FlowNodeTypeService.getFlowNodeTypes()
      .then(function (flowNodeTypes) {
        $scope.flowNodeTypes = flowNodeTypes;
      });


    var refreshFlows = function(){
      $scope.flows = FlowService.getAllFlows()
        .then(function (flows) {
          $scope.flows = flows;
          $scope.activeFlow = flows[0];
        });
    };

    refreshFlows();


    FlowService.getSessionFlow()
      .then(function (sessionFlow) {
        if (sessionFlow) {
          RED.view.importFromCommunity(sessionFlow);
        }
      });

    $scope.addFlow = function () {
      var name = 'Flow ' + ($scope.flows.length + 1);
      $scope.flows.push(FlowService.newFlow({name: name}));
    };

    $scope.isActiveFlow = function (flow) {
      return flow === $scope.activeFlow;
    };

    $scope.deleteFlow = function (flow) {
      var deleteFlowConfirmed = $window.confirm('Are you sure you want to delete ' + flow.name + '?');
      if (deleteFlowConfirmed) {
        FlowService.deleteFlow(flow.flowId).then(function(){
          refreshFlows();
        });
      }
    };

    $scope.updateNodeProperties = function () {
      if (!schemaControl.validate().length) {
        originalNode.node = schemaControl.getValue();
        originalNode.name = $scope.editingNodeName;
        originalNode.dirty = true;
        originalNode.changed = true;
      }
    };

    $scope.copySelection = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow && $scope.flowEditor.selectedNode) {
        $scope.copiedNode = JSON.stringify($scope.flowEditor.selectedNode);
      }
    };

    $scope.cutSelection = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow) {
        $scope.copiedNode = JSON.stringify($scope.flowEditor.selectedNode);
        _.pull($scope.activeFlow.nodes, $scope.flowEditor.selectedNode);
      }

      if ($scope.activeFlow) {
        _.pull($scope.activeFlow.links, $scope.flowEditor.selectedLink);
      }

      $scope.flowEditor.selectedNode = null;
      $scope.flowEditor.selectedLink = null;
    };

    $scope.deploy = function (e) {
      if (e) {
        e.preventDefault();
      }
      FlowService.deploy();
    };

    $scope.deleteSelection = function (e) {
      if (e) {
        e.preventDefault();
      }
      if ($scope.activeFlow) {
        _.pull($scope.activeFlow.nodes, $scope.flowEditor.selectedNode);
      }

      if ($scope.activeFlow) {
        _.pull($scope.activeFlow.links, $scope.flowEditor.selectedLink);
      }

      $scope.flowEditor.selectedNode = null;
      $scope.flowEditor.selectedLink = null;
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

      $scope.flowEditor.selectedNode = null;
      $scope.flowEditor.selectedLink = null;
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

    $scope.save = function (e) {
      if (e) {
        e.preventDefault();
      }
      FlowService.saveAllFlows($scope.flows);
    };

    $scope.setMousePosition = function(e) {
      $scope.currentMouseX = e.offsetX / $scope.activeFlow.zoomScale;
      $scope.currentMouseY = e.offsetY / $scope.activeFlow.zoomScale;
    };

    $scope.clearMousePosition = function() {
      $scope.currentMouseX = null;
      $scope.currentMouseY = null;
    };
  });
