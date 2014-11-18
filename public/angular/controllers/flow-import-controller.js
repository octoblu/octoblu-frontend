angular.module('octobluApp')
  .controller('FlowImportController', function ( $stateParams, $scope, TemplateService, BillOfMaterialsService) {
    TemplateService.getTemplate($stateParams.flowTemplateId).then(function(template){
      BillOfMaterialsService.generate(template.flow).then(function(billOfMaterials){
        $scope.billOfMaterials = billOfMaterials;
      });
    });
  });
