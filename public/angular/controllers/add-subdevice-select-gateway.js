'use strict';

angular.module('octobluApp')
.controller('addSubdeviceSelectGatewayController', function($scope, $stateParams, NodeTypeService, deviceService) {

  deviceService.getOnlineGenblus().then(function(genblus){
    $scope.genblus = genblus;
  });
});
