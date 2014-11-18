angular.module('octobluApp')
  .controller('FlowImportController', function ( $stateParams, $scope, TemplateService, BillOfMaterialsService) {
    TemplateService.getTemplate($stateParams.flowTemplateId).then(function(template){
      $scope.billOfMaterials = BillOfMaterialsService.generate(template.flow);
    });
  });
