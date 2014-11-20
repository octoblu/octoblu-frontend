angular.module('octobluApp')
.controller('DeviceMessageFormController', function($scope, deviceService) {
  'use strict';

  deviceService.getDeviceByUUID($scope.uuid, true).then(function(device){
    $scope.device = device;
  });
});
