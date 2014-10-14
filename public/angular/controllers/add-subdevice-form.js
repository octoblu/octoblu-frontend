angular.module('octobluApp')
.controller('addSubdeviceFormController', function($scope, $state, $stateParams, GenbluService, deviceService) {
'use strict';

  GenbluService.addDevice($stateParams.genbluId, $scope.nodeType).then(function(device){
    $scope.device = device;
  });

  $scope.submit = function(){
    deviceService.updateDevice($scope.device).then(function(){
      $state.go('ob.connector.nodes.device-detail', {uuid: $scope.device.uuid}, {replace: true});
    });
  };
});
