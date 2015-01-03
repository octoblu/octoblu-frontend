angular.module('octobluApp')
.controller('addChannelApiKeyController', function($scope, $state, nodeType, AuthService, userService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveApiKey(nodeType.channelid, $scope.newChannel.apikey, function(){
        $state.go('material.design');
      });
    });
  };
});
