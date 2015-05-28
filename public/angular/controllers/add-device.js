
angular.module('octobluApp')
.controller('addDeviceController', function ($scope, $state, $stateParams, NodeTypeService, deviceService, AuthService) {
  'use strict';

  $scope.newDevice = {
    action : "registerNew"
  };

  $scope.existingDevice = {};

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId)
  .then(function (nodeType) {
    $scope.nodeType  = nodeType;
    return deviceService.getUnclaimed($scope.nodeType.skynet.type);
  })
  .then(function (unclaimedDevices) {
    _.each(unclaimedDevices, function(device){
      device.label = device.uuid + '(' + (device.type || 'device') + ')';
    });
    $scope.newDevice.unclaimedDevices = unclaimedDevices;
  });

  $scope.setUnclaimedDevice = function(device){
    $scope.newDevice.selectedDevice = device;
  }
  $scope.addDevice = function () {
    AuthService.getCurrentUser().then(function(currentUser){

      var deviceOptions, promise;
      delete $scope.errorMessage;

      deviceOptions = _.defaults({
        type: $scope.nodeType.type,
        name: $scope.newDevice.name
      }, $scope.nodeType.defaults);

      if($scope.nodeType.payloadOnly){
        deviceOptions.payloadOnly = $scope.nodeType.payloadOnly;
      }

     if($scope.newDevice.action === 'addUnclaimed'){

        deviceOptions.uuid = $scope.newDevice.selectedDevice.uuid;
        promise = deviceService.claimDevice(deviceOptions);
      } else if($scope.newDevice.action === 'claimExisting'){

        deviceOptions.uuid = $scope.existingDevice.uuid;
        deviceOptions.token = $scope.existingDevice.token;
        deviceOptions.owner = currentUser.skynet.uuid;
        deviceOptions.isChanged = true;
        promise = deviceService.claimDevice(deviceOptions);
      } else {

        promise = deviceService.registerDevice(deviceOptions);
      }

      promise.then(function (data) {
        if(data.type === "device:gateblu"){
          $state.go("material.nodewizard.addnode");
        }
        else{
          $state.go("material.design");
        }
      }, function (error) {
        $scope.errorMessage = error;
      });
    });
  };
});
