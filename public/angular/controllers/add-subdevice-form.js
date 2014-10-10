angular.module('octobluApp')
.controller('addSubdeviceFormController', function($scope, $state, $stateParams, GenbluService) {
'use strict';

  GenbluService.addDevice($stateParams.genbluId, $scope.nodeType).then(function(device){
    $state.go('ob.connector.nodes.device-detail', {uuid: device.uuid}, {replace: true});
  });
});
