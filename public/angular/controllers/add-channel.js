'use strict';

angular.module('octobluApp')
.controller('addChannelController', function(OCTOBLU_API_URL, $scope, $stateParams, nodeType) {
  $scope.nodeType = nodeType;

  var redirectToDesign = $stateParams.designer || false;
  var redirectToWizard = $stateParams.wizard || false;

  var linkTo = {
    linkTo: 'material.things',
    label: 'All Things'
  };

  if(redirectToDesign){
    linkTo = {
      linkTo: 'material.design',
      label: 'Designer'
    }
  };

  if(redirectToWizard){
    linkTo = {
      linkTo: 'material.flowConfigure',
      label: 'Flow Configure',
      params: {flowId: $stateParams.wizardFlowId, nodeIndex: $stateParams.wizardNodeIndex}
    }
  };

  $scope.fragments = [linkTo, {label: "Add " + nodeType.name}]
});
