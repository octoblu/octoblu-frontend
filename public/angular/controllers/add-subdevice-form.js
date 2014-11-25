angular.module('octobluApp')
.controller('addSubdeviceFormController', function($scope, $state, $stateParams, GatebluService, deviceService, NodeTypeService) {
  'use strict';

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId).then(function(nodeType){
    $scope.nodeType = nodeType;
  }).then(function(){
    return GatebluService.addDevice($stateParams.gatebluId, $scope.nodeType)
  }).then(function(device){
    $scope.device = device;
  });

  $scope.submit = function(){
    deviceService.updateDevice($scope.device).then(function(){
      $state.go('material.design');
    });
  };
});
