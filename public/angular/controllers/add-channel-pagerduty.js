angular.module('octobluApp')
.controller('addChannelPagerdutyController', function($scope, $state, $stateParams, nodeType, AuthService, userService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.savePagerdutyApi(nodeType.channelid, $scope.newChannel.token, function(){
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
