angular.module('octobluApp')
  .controller('FlowImportController', function ( $state, $stateParams, $scope, TemplateService, BillOfMaterialsService) {
    TemplateService.getTemplate($stateParams.flowTemplateId).then(function(template){
      BillOfMaterialsService.generate(template.flow).then(function(billOfMaterials){
        $scope.billOfMaterials = billOfMaterials;
      });
    });

    $scope.import = function() {
      TemplateService.importTemplate($stateParams.flowTemplateId).then(function(flow){
        $state.go('flow', {flowId: flow.flowId});
      })
    };
  });
