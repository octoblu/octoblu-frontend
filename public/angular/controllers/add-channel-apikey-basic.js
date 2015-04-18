'use strict';

angular.module('octobluApp')
.controller('addChannelApiKeyBasicController', function(OCTOBLU_API_URL, $scope, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
       $scope.newChannel.apiKey, '',
       function () {
        $state.go('material.design');
      });
    });
  };
});
