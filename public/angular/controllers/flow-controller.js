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
    }
    refreshFlows();


    FlowService.getSessionFlow()
      .then(function (sessionFlow) {
        if (sessionFlow) {
          RED.view.importFromCommunity(sessionFlow);
        }
      });

    $scope.addFlow = function () {
      var name = 'Flow ' + ($scope.flows.length + 1);
      $scope.flows.push(FlowService.newFlow(name));
    };

    $scope.isActiveFlow = function (flow) {
      return flow === $scope.activeFlow;
    };

    $scope.setActiveFlow = function (flow) {
      $scope.activeFlow = flow;
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

    $scope.deploy = function () {
      // RED.nodes.createCompleteNodeSet()
      FlowService.deploy();
    };

    $scope.deleteSelection = function () {
      if ($scope.activeFlow) {
        _.pull($scope.activeFlow.nodes, $scope.flowEditor.selectedNode);
      }

      if ($scope.activeFlow) {
        _.pull($scope.activeFlow.links, $scope.flowEditor.selectedLink);
      }

      $scope.flowEditor.selectedNode = null;
      $scope.flowEditor.selectedLink = null;
    };

    $scope.zoomIn = function () {
      if ($scope.activeFlow.zoomScale + 0.25 <= 2) {
        $scope.activeFlow.zoomScale += 0.25;
      }
    };
    $scope.zoomOut = function () {
      if ($scope.activeFlow.zoomScale - 0.25 >= 0.25) {
        $scope.activeFlow.zoomScale -= 0.25;
      }
    };

    $scope.save = function () {
      FlowService.saveAllFlows($scope.flows);
    }
  });
