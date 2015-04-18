'use strict';

angular.module('octobluApp')
.controller('AddSubdeviceSelectGatebluController', function(OCTOBLU_API_URL, $scope, $stateParams, NodeTypeService, deviceService) {

  deviceService.getOnlineGateblus().then(function(gateblus){
    $scope.gateblus = gateblus;
  });
});
