'use strict';

angular.module('octobluApp')
.controller('addChannelMeshbluController', function($scope, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
        user.skynet.uuid, user.skynet.token,
        function () {
          $state.go('material.design');
        });
    });
  };
});
