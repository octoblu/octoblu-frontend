angular.module('octobluApp')
.controller('DesignerController', function ($state, FlowService) {

  FlowService.getAllFlows().then(function (flows) {
    var newActiveFlow = _.first(flows);

    FlowService.saveFlow(newActiveFlow).then(function(){
      $state.go('flow', {flowId: newActiveFlow.flowId});
    });
  });

});
