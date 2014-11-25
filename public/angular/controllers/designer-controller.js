angular.module('octobluApp')
.controller('DesignerController', function ($state, $scope, $cookies, FlowService) {

  FlowService.getAllFlows().then(function (flows) {
    var flowId;
    $state.flows = flows;
    if ($cookies.currentFlowId) {
      flowId = $cookies.currentFlowId;
    } else {
      flowId = _.first(flows).flowId;
    }
    $state.go('material.flow', {flowId: flowId}, {location: 'replace'});
  });

  $scope.getActiveFlow = function () {
    return FlowService.getActiveFlow();
  };

  $scope.setActiveFlow = function (flow) {
    $scope.activeFlow = flow;
    FlowService.setActiveFlow($scope.activeFlow);
  };

  $scope.isActiveFlow = function (flow) {
    return flow === $scope.activeFlow;
  };

  $scope.addFlow = function () {
    return FlowService.createFlow().then(function (newFlow) {
      $state.go('material.flow', {flowId: newFlow.flowId});
    });
  };

  $scope.deleteFlow = function (flow) {
    var deleteFlowConfirmed = $window.confirm('Are you sure you want to delete ' + flow.name + '?');
    if (deleteFlowConfirmed) {
      FlowService.deleteFlow(flow.flowId).then(function () {
        $state.go('material.design', {}, {reload: true});
      });
    }
  };
});
