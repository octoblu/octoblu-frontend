angular.module('octobluApp')
.controller('DevicePickerController', function($scope) {
  'use strict';

  $scope.$watch('model.uuid', function(){
    var device = _.findWhere($scope.devices, {uuid: $scope.model.uuid});

    if(device){
      $scope.model.token = device.token;
    }
  });
});
