angular.module('octobluApp')
.controller('addChannelDocuSignController', function($scope, $state, $stateParams, nodeType, userService, AuthService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
        $scope.newChannel.user, $scope.newChannel.pass,
        function () {
          var redirectToDesign = $stateParams.designer || false;
          var redirectToWizard = $stateParams.wizard || false;
          var route = 'material.things.my';
          var params = {added: nodeType.name};
          if(redirectToWizard){
            route = 'material.flowConfigure';
            params = {flowId: $stateParams.wizardFlowId, nodeIndex: $stateParams.wizardNodeIndex};
          }
          if(redirectToDesign){
            route = 'material.design';
          }
          $state.go(route, params);
      });
    });
  };
});
