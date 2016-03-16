angular.module('octobluApp')
.controller('addChannelApiKeyController', function($scope, $state, $stateParams, nodeType, AuthService, userService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveApiKey(nodeType.channelid, $scope.newChannel.apikey, function(){
        var redirectToDesign = $stateParams.designer || false;
        var redirectToWizard = $stateParams.wizard || false;
        var route = 'material.configure';
        var params = {added: nodeType.name};
        if(redirectToWizard){
          route = 'material.flowConfigure';
          params = {flowId: $stateParams.wizardFlowId};
        }
        if(redirectToDesign){
          route = 'material.design';
        }
        $state.go(route, params);
      });
    });
  };
});
