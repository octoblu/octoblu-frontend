'use strict';

angular.module('octobluApp')
.controller('addChannelMeshbluController', function(OCTOBLU_API_URL, $scope, $cookies, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
        $cookies.meshblu_auth_uuid, $cookies.meshblu_auth_token,
        function () {
          $state.go('material.design');
        });
    });
  };
});
