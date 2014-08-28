angular.module('octobluApp')
.controller('OmniboxController', function($scope, OmniService) {
  'use strict';

  var fetchFlowNodes = function(flowNodes){
    OmniService.fetch(flowNodes).then(function(omniList){
      $scope.omniList = omniList;
    });
  }

  $scope.$watch('flowNodes', fetchFlowNodes);

  $scope.itemSelected = function(newItem) {
    $scope.flowNodes.push(newItem);
  };
});
