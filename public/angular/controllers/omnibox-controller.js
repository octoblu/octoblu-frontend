angular.module('octobluApp')
.controller('OmniboxController', function($scope, OmniService) {
  'use strict';

  var fetchFlowNodes = function(flowNodes){
    OmniService.fetch(flowNodes).then(function(omniList){
      $scope.omniList = omniList;
    });
  };

  $scope.$watchCollection('flowNodes', fetchFlowNodes);

  $scope.selectItem = function(item) {
    OmniService.selectItem(item).then(function(nodeType){
      $scope.nodeType = nodeType;
//      fetchFlowNodes($scope.flowNodes);
    });
  };

  $scope.getOmniboxItemTemplate = function(item) {
    return '/pages/omnibox-item-' + item.category + '.html';
  };
});
