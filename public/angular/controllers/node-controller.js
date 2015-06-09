angular.module('octobluApp')
.controller('NodeController', function ($scope, $state, NodeService, OCTOBLU_ICON_URL) {
  'use strict';

  $scope.loading = true;

  NodeService.getNodes().then(function(nodes){
    nodes = _.map(nodes, addLogoUrl);
    $scope.loading = false;
    $scope.nodes = nodes;
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
  };

  $scope.filterFlows = function(node) {
    return node.type !== 'device:flow'
  }

});
