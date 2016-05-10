'use strict';

angular.module('octobluApp')
.controller('nodeWizardController', function($scope, $state, NodeService, DeviceLogo) {
  NodeService.getNodes().then(function(nodes){
    nodes = _.map(nodes, addLogoUrl);
    $scope.loading = false;
    $scope.configuredNodes = nodes;
  });

  function addLogoUrl(node){
    node.logo = new DeviceLogo(node).get();
    return node;
  }

});
