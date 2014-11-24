angular.module('octobluApp')
.controller('NodeController', function ($scope, $state, NodeService) {
  'use strict';

  NodeService.getNodes().then(function(nodes){
    $scope.nodes = nodes;
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
  };

  $scope.filterFlows = function(node) {
    return node.type !== 'device:flow';
  }

});
