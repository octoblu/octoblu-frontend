angular.module('octobluApp')
  .controller('DesignerController', function ($state, FlowService) {
    FlowService.getAllFlows()
      .then(function (flows) {
        $state.go('flow', {flowId: _.first(flows).flowId});
    });
});
