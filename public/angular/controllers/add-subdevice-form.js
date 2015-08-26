angular.module('octobluApp')
.controller('addSubdeviceFormController', function(OCTOBLU_API_URL, $scope, $state, $stateParams, GatebluService, ThingService, NodeTypeService) {
  'use strict';
  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId).then(function(nodeType){
    $scope.nodeType = nodeType;
  }).then(function(){
    return GatebluService.addDevice($stateParams.gatebluId, $scope.nodeType);
  }).then(function(device){
    return ThingService.getThing({uuid: device.uuid});
  }).then(function(device){
    $scope.device = device;
  });

  $scope.saveDevice = function(){
    return ThingService.updateDevice($scope.device).then(function(){
      $state.go('material.design');
    });
  };
});
