angular.module('octobluApp')
.controller('FlowImportController', function ( $state, $stateParams, $scope, BluprintService, BillOfMaterialsService) {

  BluprintService.getBluprint($stateParams.flowTemplateId).then(function(bluprint){
    $scope.bluprint = bluprint;
    return BillOfMaterialsService.generate(bluprint.flow);
  }).then(function(billOfMaterials){
    $scope.billOfMaterials = billOfMaterials;
  });

  $scope.import = function() {
    BluprintService.importBluprint($stateParams.flowTemplateId).then(function(flow){
      $scope.importing = true;
      _.delay(function(){
        $state.go('material.flow', {flowId: flow.flowId});
      }, 1000);
    })
  };
});
