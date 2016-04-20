'use strict';

angular.module('octobluApp')
.controller('AddSubdeviceSelectGatebluController', function($scope, NodeTypeService, $stateParams, ThingService) {

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId)
    .then(function(nodeType){
      $scope.nodeType = nodeType;
    });

  ThingService.getThings({type: 'device:gateblu'})
    .then(function(gateblus){
      $scope.gateblus = gateblus;
    });
});
