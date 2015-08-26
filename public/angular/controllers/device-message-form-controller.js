angular.module('octobluApp')
.controller('DeviceMessageFormController', function(OCTOBLU_API_URL, $scope, ThingService, NotifyService) {
  'use strict';

  $scope.schema = {};

  var getDevice = function(){
    $scope.device = null;
    ThingService.getThings().then(function(devices){
      $scope.device = _.findWhere(devices, {uuid: $scope.uuid});
      $scope.device.options = $scope.device.options || {};
    });
  };

  var saveDevice = function(){
    if (!$scope.device) {
      return;
    }
    ThingService.updateDevice(_.pick($scope.device, 'uuid', 'name', 'options'))
    .then(function(){
      NotifyService.notify('Changes Saved');
    });
  }

  $scope.$watch('uuid', getDevice);
});
