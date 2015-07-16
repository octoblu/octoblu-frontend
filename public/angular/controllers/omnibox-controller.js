angular.module('octobluApp')
.controller('OmniboxController', function(OCTOBLU_API_URL, $scope, OmniService) {
  'use strict';
  var fetchFlowNodes = function(flowNodes){
    OmniService.fetch(flowNodes).then(function(omniList){
      $scope.omniList = omniList;
    });
  };

  $scope.omniboxFocus = false;
  $scope.$watchCollection('flowNodes', fetchFlowNodes);

  $scope.selectItem = function(item) {
    OmniService.selectItem(item);
  };

  $scope.focus = function(e) {
    e.preventDefault();
    $scope.omniboxFocus = true;
  };

  $scope.getOmniboxItemTemplate = function(item) {
    return '/pages/omnibox-item-' + item.category + '.html';
  };
});
