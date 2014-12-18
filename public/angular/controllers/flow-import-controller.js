angular.module('octobluApp')
.controller('FlowImportController', function ( $state, $stateParams, $scope, TemplateService) {

  TemplateService.getTemplate($stateParams.flowTemplateId).then(function(template){
    $scope.template = template;
  });

  $scope.import = function() {
    TemplateService.importTemplate($stateParams.flowTemplateId).then(function(flow){
      $scope.importing = true;
      _.delay(function(){
        $state.go('material.flow', {flowId: flow.flowId});
      }, 1000);
    })
  };
});
