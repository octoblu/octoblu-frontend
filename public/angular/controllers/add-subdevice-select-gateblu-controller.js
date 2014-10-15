'use strict';

angular.module('octobluApp')
.controller('AddSubdeviceSelectGatebluController', function($scope, $stateParams, NodeTypeService, deviceService) {

  deviceService.getOnlineGateblus().then(function(gateblus){
    $scope.gateblus = gateblus;
  });
});
