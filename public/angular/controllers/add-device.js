
angular.module('octobluApp')
.controller('addDeviceController', function ($scope, $state, $stateParams, NodeTypeService, deviceService, AuthService) {
  'use strict';

  $scope.newDevice = {};
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
    $scope.newDevice.selectedDevice = _.first(unclaimedDevices);
    $scope.newDevice.unclaimedDevices.unshift({type: 'existing', label: 'Claim Existing'});
  });

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

      if ($scope.newDevice.selectedDevice) {
        if ($scope.newDevice.selectedDevice.type === 'existing') {
          deviceOptions.uuid = $scope.existingDevice.uuid;
          deviceOptions.token = $scope.existingDevice.token;
          deviceOptions.owner = currentUser.skynet.uuid;
          deviceOptions.isChanged = true;
          promise = deviceService.claimDevice(deviceOptions);
        } else {
          deviceOptions.uuid = $scope.newDevice.selectedDevice.uuid;
          promise = deviceService.claimDevice(deviceOptions);
        }
      } else {
        promise = deviceService.registerDevice(deviceOptions);
      }

      promise.then(function (data) {
        $state.go("material.design");
      }, function (error) {
        $scope.errorMessage = error;
      });
    });
  };
});
