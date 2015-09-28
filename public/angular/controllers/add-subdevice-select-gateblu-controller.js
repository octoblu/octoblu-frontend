'use strict';

angular.module('octobluApp')
.controller('AddSubdeviceSelectGatebluController', function($scope, deviceService) {

  deviceService.getOnlineGateblus().then(function(gateblus){
    $scope.gateblus = gateblus;
  });
});
