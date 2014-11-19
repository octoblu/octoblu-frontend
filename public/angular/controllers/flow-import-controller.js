angular.module('octobluApp')
.controller('FlowImportController', function ( $state, $stateParams, $scope, TemplateService, BillOfMaterialsService) {

  TemplateService.getTemplate($stateParams.flowTemplateId).then(function(template){
    $scope.template = template;
    return BillOfMaterialsService.generate(template.flow);
  }).then(function(billOfMaterials){
    $scope.billOfMaterials = billOfMaterials;
  });

  $scope.import = function() {
    TemplateService.importTemplate($stateParams.flowTemplateId).then(function(flow){
      $scope.importing = true;
      _.delay(function(){
        $state.go('flow', {flowId: flow.flowId});
      }, 1000);
    })
  };
});
