'use strict';

angular.module('octobluApp')
.controller('addSubdeviceController', function(OCTOBLU_API_URL, $scope, $stateParams, NodeTypeService, deviceService) {
  $scope.newSubDevice = {};

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId).then(function(nodeType){
    $scope.nodeType = nodeType;
    $scope.fragments = [{linkTo: 'material.things', label: 'All Things'}, {label: "Add " + nodeType.name}]
  });
});
