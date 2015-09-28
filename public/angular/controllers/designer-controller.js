angular.module('octobluApp')
.controller('DesignerController', function ($state, $scope, $stateParams, $cookies, FlowService, NotifyService) {
  if ($stateParams.added) {
    var device = $stateParams.added
    NotifyService.notify(device + " successfully added!");
  }
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
