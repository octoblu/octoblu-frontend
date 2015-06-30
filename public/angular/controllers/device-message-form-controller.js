angular.module('octobluApp')
.controller('DeviceMessageFormController', function(OCTOBLU_API_URL, $scope, ThingService) {
  'use strict';

  $scope.schema = {};

  var getDevice = function(){
    $scope.device = null;
    ThingService.getThings().then(function(devices){
      $scope.device = _.findWhere(devices, {uuid: $scope.uuid});
    });
  };

  $scope.$watch('uuid', getDevice);
});
