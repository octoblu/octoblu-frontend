angular.module('octobluApp')
.controller('addNodeController', function(OCTOBLU_API_URL, $scope, $state, NodeTypeService) {
  'use strict';

  $scope.nodeCollection = [];
  $scope.loadingNodes = true;

  NodeTypeService.getNodeTypes().then(function(nodeTypes){
    $scope.nodeTypes = nodeTypes;
    $scope.activeTab = 'all'
    $scope.loadingNodes = false;
  });

  $scope.nextStepUrl = function (node) {
    var sref = 'material.' + node.category;
    var params = {};
    if (node.category === 'device' || node.category === 'microblu') {
      params.uuid = node.uuid;
    } else if (node.category === 'channel') {
      params.id = node.channelid;
    }
    return $state.href(sref, params);
  };

  $scope.isAvailable = function (node) {
    if (node.category === 'device' || node.category === 'microblu') {
      return node.resource.online;
    }
    return true;
  }

  $scope.categoryFilter = function(node) {
    return node
  }

  var filterFlows = function(node) {
    return node.type !== 'device:flow'
  }

  var filterChannels = function(node) {
    return (node.category === 'channel');
  }

  var filterDevicesAndMicroblu = function(node) {
    return (node.category === 'device' || node.category === 'microblu');
  }

  $scope.$watch('activeTab', function(newTab) {
    if (newTab === 'configured') {
      $scope.nodeCollection = $scope.configuredNodes;
      $scope.categoryFilter = filterFlows;
    } else {
      $scope.nodeCollection = $scope.nodeTypes;

      if (newTab === 'all') $scope.categoryFilter = null;
      if (newTab === 'channels') $scope.categoryFilter = filterChannels;
      if (newTab === 'devices') $scope.categoryFilter = filterDevicesAndMicroblu;
    }
  });
});
