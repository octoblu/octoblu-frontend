angular.module('octobluApp')
.controller('addNodeController', function(OCTOBLU_API_URL, OCTOBLU_ICON_URL, $scope, $state, $stateParams, NodeTypeService) {
  'use strict';

  $scope.devices = [];
  $scope.loading = true;
  $scope.activeTab = $stateParams.tab || 'all'

  NodeTypeService.getNodeTypes().then(function(devices){
    $scope.devices = devices;
    $scope.loading = false;
  });

  $scope.isAvailable = function (node) {
    if (node.category === 'device' || node.category === 'microblu') {
      return node.resource.online;
    }
    return true;
  }

  $scope.categoryFilter = function(node) {
    return node
  }

  var filterAll = function(node) {
    return true;
  }

  var filterChannels = function(node) {
    return (node.category === 'channel');
  }

  var filterDevicesAndMicroblu = function(node) {
    return (node.category === 'device' || node.category === 'microblu');
  }

  $scope.$watch('loading', function(isLoading) {
    if (!isLoading) setNodesForTab($scope.activeTab);
  });

  $scope.$watch('activeTab', function(newTab) {
    setNodesForTab(newTab);
  });

  var setNodesForTab = function(tab) {
    if (tab === 'all') $scope.categoryFilter = filterAll;
    if (tab === 'channels') $scope.categoryFilter = filterChannels;
    if (tab === 'devices') $scope.categoryFilter = filterDevicesAndMicroblu;
  };
});
