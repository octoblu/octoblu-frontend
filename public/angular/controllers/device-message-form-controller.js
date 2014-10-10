angular.module('octobluApp')
.controller('DeviceMessageFormController', function($scope, deviceService) {
  'use strict';

  deviceService.getDeviceByUUIDAndToken($scope.uuid, $scope.token).then(function(device){
    $scope.device = device;
  });
});
