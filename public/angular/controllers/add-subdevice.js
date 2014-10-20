'use strict';

angular.module('octobluApp')
.controller('addSubdeviceController', function($scope, $stateParams, NodeTypeService, deviceService) {
  $scope.newSubDevice = {};

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId).then(function(nodeType){
    $scope.nodeType = nodeType;
  });
});
