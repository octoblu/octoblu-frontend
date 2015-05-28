angular.module('octobluApp')
.controller('addNodeController', function(OCTOBLU_API_URL, $scope, $state, NodeTypeService) {
  'use strict';

  NodeTypeService.getUnconfiguredNodeTypes().then(function(nodeTypes){
    $scope.nodeTypes = nodeTypes;
  });
});
