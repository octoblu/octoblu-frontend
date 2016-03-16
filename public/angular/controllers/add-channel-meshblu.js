'use strict';

angular.module('octobluApp')
.controller('addChannelMeshbluController', function($scope, $cookies, $state, $stateParams, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
        $cookies.meshblu_auth_uuid, $cookies.meshblu_auth_token,
        function () {
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
