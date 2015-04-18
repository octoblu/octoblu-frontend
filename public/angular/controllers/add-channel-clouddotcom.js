'use strict';

angular.module('octobluApp')
.controller('addChannelCloudDotComController', function(OCTOBLU_API_URL, $scope, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveCloudDotComApi(user.resource.uuid, nodeType.channelid, $scope.newChannel.user, $scope.newChannel.pass, function () {
        $state.go('material.design');
      });
    });
  };
});
