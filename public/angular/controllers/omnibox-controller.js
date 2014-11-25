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
    OmniService.selectItem(item);
  };

  $scope.getOmniboxItemTemplate = function(item) {
    return '/pages/omnibox-item-' + item.category + '.html';
  };
});
