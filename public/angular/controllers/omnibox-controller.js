angular.module('octobluApp')
.controller('OmniboxController', function($scope, FlowNodeTypeService, NodeTypeService) {
  'use strict';

  $scope.omniList = [];

  NodeTypeService.getNodeTypes().then(function(nodeTypes){
    $scope.omniList = _.union($scope.omniList, nodeTypes);
  });

  FlowNodeTypeService.getFlowNodeTypes().then(function(flowNodeTypes){
    $scope.omniList = _.union($scope.omniList, flowNodeTypes);
  });

  $scope.$watchCollection($scope.flowNodes, function(){
    $scope.omniList = _.union($scope.omniList, $scope.flowNodes);
  });
});
