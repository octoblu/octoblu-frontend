'use strict';

angular.module('octobluApp')
.controller('nodeWizardController', function($scope, $state, NodeService, OCTOBLU_ICON_URL) {
  console.log('Node Wizard Controller');

  NodeService.getNodes().then(function(nodes){
    nodes = _.map(nodes, addLogoUrl);
    $scope.loading = false;
    $scope.configuredNodes = nodes;
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

});
