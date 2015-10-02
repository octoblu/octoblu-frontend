'use strict';

angular.module('octobluApp')
.controller('AddSubdeviceSelectGatebluController', function($scope, deviceService, NodeTypeService, $stateParams) {

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId)
    .then(function(nodeType){
      $scope.nodeType = nodeType;
    });

  deviceService.getOnlineGateblus()
    .then(function(gateblus){
      $scope.gateblus = gateblus;
    });
});
