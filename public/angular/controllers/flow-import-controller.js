angular.module('octobluApp')
.controller('FlowImportController', function ( $state, $stateParams, $scope, BluprintService) {
  $scope.loadingBluprint = true;
  BluprintService.getBluprint($stateParams.flowTemplateId).then(function(bluprint){
    $scope.bluprint = bluprint;
    $scope.loadingBluprint = false;
  })

  $scope.import = function() {
    BluprintService.importBluprint($stateParams.flowTemplateId).then(function(flow){
      $scope.importing = true;
      _.delay(function(){
        $state.go('material.flow', {flowId: flow.flowId});
      }, 1000);
    })
  };
});
