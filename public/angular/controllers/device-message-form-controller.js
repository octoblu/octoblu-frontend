angular.module('octobluApp')
.controller('DeviceMessageFormController', function(OCTOBLU_API_URL, $scope, ThingService, NotifyService) {
  'use strict';

  $scope.schema = {};

  var getDevice = function(){
    $scope.device = null;
    $scope.loading = true;
    ThingService.getThing({ uuid: $scope.uuid })
      .then(function(device){
        $scope.device = device
        $scope.device.options = $scope.device.options || {}
        $scope.loading = false;
      })
      .catch(function(error){
        NotifyService.notifyError(error)
      });
  };

  $scope.$watch('uuid', getDevice);
});
