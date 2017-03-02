'use strict';

angular.module('octobluApp')
.controller('addChannelMeshbluController', function($scope, $cookies, $state, $stateParams, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveMeshbluApi(nodeType.channelid,
        $cookies.meshblu_auth_uuid,
        function (error) {
          if (error) {
            console.error(error)
            return
          }
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
