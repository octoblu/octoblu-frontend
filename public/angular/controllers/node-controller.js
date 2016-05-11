angular.module('octobluApp')
.controller('NodeController', function ($scope, $state, NodeService, DeviceLogo) {
  'use strict';

  $scope.loading = true;

  NodeService.getNodes().then(function(nodes){
    nodes = _.map(nodes, addLogoUrl);
    $scope.loading = false;
    $scope.nodes = nodes;
  });

  function addLogoUrl(node){
    node.logo = new DeviceLogo(node).get();
    return node;
  }

  $scope.nextStepUrl = function (node) {
    var sref;
    var params = {};
    if (node.category === 'channel') {
      sref = 'material.' + node.category;
      params.id = node.channelid;
    } else if (node.category === 'microblu') {
      sref = 'material.microblu';
      params.uuid = node.uuid;
    } else {
      sref = 'material.device';
      params.uuid = node.uuid;
    }
    return $state.href(sref, params);
  };

  $scope.isAvailable = function (node) {
    if (node.category === 'device' || node.category === 'microblu') {
      return node.resource.online;
    }
    return true;
  };

  $scope.filterFlows = function(node) {
    if (node.type === 'device:flow') {
      return true;
    }
    if (node.type === 'octoblu:flow') {
      return true;
    }
    return false;
  }

});
