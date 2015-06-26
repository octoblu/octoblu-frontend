angular.module('octobluApp')
.controller('addNodeController', function(OCTOBLU_API_URL, $scope, $state, NodeTypeService) {
  'use strict';

  $scope.sortNodeMethod = 'name';

  NodeTypeService.getNodeTypes().then(function(nodeTypes){
    $scope.nodeTypes = nodeTypes;
  });


});
