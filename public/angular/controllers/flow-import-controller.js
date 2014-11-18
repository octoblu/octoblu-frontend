angular.module('octobluApp')
  .controller('FlowImportController', function ( $stateParams, $scope, FlowService, BillOfMaterialsService) {
    FlowService.getFlow($stateParams.flowTemplateId).then(function(flow){
      $scope.billOfMaterials = BillOfMaterialsService.generate(flow);
    });
  });