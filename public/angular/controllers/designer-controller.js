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
});
