angular.module('octobluApp')
.controller('addNodeController', function(OCTOBLU_API_URL, OCTOBLU_ICON_URL, $scope, $state, $stateParams, NodeTypeService, NodeService) {
  'use strict';

  $scope.nodeCollection = [];
  $scope.loadingNodes = true;
  $scope.activeTab = $stateParams.tab || 'all'

  NodeTypeService.getNodeTypes().then(function(nodeTypes){
    $scope.nodeTypes = nodeTypes;

    NodeService.getNodes().then(function(nodes){
      nodes = _.map(nodes, addLogoUrl);
      $scope.configuredNodes = nodes;
      $scope.loadingNodes = false;
    });
  });

  function addLogoUrl(node){
    if(node.logo){
      return node;
    }
    if(node && node.type){
      var type = node.type.replace('octoblu:', 'node:');
      node.logo = OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg';
    } else {
      node.logo = OCTOBLU_ICON_URL + 'node/other.svg';
    }
    return node;
  }

  $scope.nextStepUrl = function (node) {
    var sref = 'material.' + node.category;
    var params = {};

    //If node is configured, go to device detail page
    if (node.uuid) {
      if (node.category === 'device' || node.category === 'microblu') {
        params.uuid = node.uuid;
      } else if (node.category === 'channel') {
        params.id = node.channelid;
      }
    }
    //Go to add node page if not configured
    else {
      sref = 'material.nodewizard.add'
      params.nodeTypeId = node._id
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

  var filterChannels = function(node) {
    return (node.category === 'channel');
  }

  var filterDevicesAndMicroblu = function(node) {
    return (node.category === 'device' || node.category === 'microblu');
  }

  $scope.$watch('loadingNodes', function(isLoading) {
    if (!isLoading) setNodesForTab($scope.activeTab);
  });

  $scope.$watch('activeTab', function(newTab) {
    setNodesForTab(newTab);
  });

  var setNodesForTab = function(tab) {
    if (tab === 'configured') {
      $scope.nodeCollection = $scope.configuredNodes;
      $scope.categoryFilter = null;
    } else {
      $scope.nodeCollection = $scope.nodeTypes;

      if (tab === 'all') $scope.categoryFilter = null;
      if (tab === 'channels') $scope.categoryFilter = filterChannels;
      if (tab === 'devices') $scope.categoryFilter = filterDevicesAndMicroblu;
    }
  };
});
