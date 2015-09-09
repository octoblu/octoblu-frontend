angular.module('octobluApp')
.controller('addSubdeviceFormController', function(OCTOBLU_API_URL, $scope, $state, $stateParams, GatebluService, ThingService, NodeTypeService, GatebluLogService) {
  'use strict';

  var gatebluLogger = new GatebluLogService();

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId).then(function(nodeType){
    $scope.nodeType = nodeType;
  }).then(function(){
    gatebluLogger.addDeviceBegin($stateParams.gatebluId, $scope.nodeType.connector);
    return GatebluService.addDevice($stateParams.gatebluId, $scope.nodeType, gatebluLogger);
  }).then(function(device){
    gatebluLogger.addDeviceEnd(device.uuid, device.gateblu, device.connector);
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
