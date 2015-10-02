'use strict';

angular.module('octobluApp')
.controller('addChannelMeshbluController', function($scope, $cookies, $state, $stateParams, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
        $cookies.meshblu_auth_uuid, $cookies.meshblu_auth_token,
        function () {
          var redirectToDesign = $stateParams.designer || false;
          if(redirectToDesign){
            $state.go('material.design', {added: nodeType.name});
          }
          else{
            $state.go('material.configure', {added: nodeType.name});
          }
        });
    });
  };
});
