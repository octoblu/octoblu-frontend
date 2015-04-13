angular.module('octobluApp')
.controller('DeviceMessageFormController', function($scope, deviceService) {
  'use strict';

  $scope.form = ['*'];
  $scope.schema = {};

  var getDevice = function(){
    deviceService.getDeviceByUUID($scope.uuid, true).then(function(device){
      $scope.device = device;
      $scope.schema = device.messageSchema;
      console.log('done gotDeviceByUuuid', JSON.stringify($scope.schema, null, 2));
    });
  };

  $scope.$watch('uuid', getDevice);
});
