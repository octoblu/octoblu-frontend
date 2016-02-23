angular.module('octobluApp')
.controller('addChannelApiKeyController', function($scope, $state, $stateParams, nodeType, AuthService, userService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      $scope.newChannel.apikey = 'Token token=' + $scope.newChannel.apikey;
      userService.saveApiKey(nodeType.channelid, $scope.newChannel.apikey, function(){
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
