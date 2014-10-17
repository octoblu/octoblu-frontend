angular.module('octobluApp')
.controller('addNodeController', function($scope, $state, NodeTypeService) {
  'use strict';

  NodeTypeService.getNodeTypes().then(function(nodeTypes){
    $scope.nodeTypes = nodeTypes;
  });
});
