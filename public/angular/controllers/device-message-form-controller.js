angular.module('octobluApp')
.controller('DeviceMessageFormController', function(OCTOBLU_API_URL, $scope, deviceService) {
  'use strict';

  $scope.schema = {};

  var getDevice = function(){
    deviceService.getDeviceByUUID($scope.uuid, true).then(function(device){
      $scope.device = device;
    });
  };

  $scope.$watch('uuid', getDevice);
});
