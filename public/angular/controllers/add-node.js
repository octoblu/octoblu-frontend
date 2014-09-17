'use strict';
angular.module('octobluApp')
.controller('addNodeController', function($scope, $state, NodeTypeService) {
  NodeTypeService.getNodeTypes().then(function(nodeTypes){
    $scope.nodeTypes = nodeTypes;
  });

  $scope.nextStepUrl = function(nodeType){
    var sref = 'ob.nodewizard.add'+nodeType.category;
    return $state.href(sref, {nodeTypeId: nodeType._id});
  };

  $scope.logoUrl = function(nodeType) {
    return 'https://s3-us-west-2.amazonaws.com/octoblu-icons/' + nodeType.type.replace(':', '/') + '.svg';
  };
});
