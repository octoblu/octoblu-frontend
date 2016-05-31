angular.module('octobluApp')
.controller('addSubdeviceFormController', function(OCTOBLU_API_URL, $scope, $state, $stateParams, GatebluService, ThingService, NodeTypeService, GatebluLogService) {
  'use strict';

  var gatebluLogger = new GatebluLogService();
  var deviceToAdd = {};

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId).then(function(nodeType){
    $scope.nodeType = nodeType;
  }).then(function(){
    $scope.registering = true;
    $scope.updating = true;
    $scope.loading = true;
    gatebluLogger.addDeviceBegin($stateParams.gatebluId, $scope.nodeType.connector);
    return GatebluService.addDevice($stateParams.gatebluId, $scope.nodeType, gatebluLogger);
  }).then(function(results){
    $scope.registering = false;
    deviceToAdd = results[0];
    return GatebluService.updateGateblu(results, gatebluLogger);
  }).then(function(gateblu){
    $scope.updating = false;
    return GatebluService.waitForDeviceToHaveOptionsSchema(deviceToAdd, gatebluLogger);
  }).then(function(device){
    $scope.loading = false
    gatebluLogger.addDeviceEnd(device.uuid, device.gateblu, device.connector);
    return ThingService.getThing({uuid: device.uuid});
  }).then(function(device){
    $scope.device = device;
  });

  $scope.saveDevice = function(){
    return ThingService.updateDevice($scope.device).then(function(){
      $state.go('material.things.my', {added: $scope.device.name});
    });
  };
});
