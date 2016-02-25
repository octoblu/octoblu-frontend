angular.module('octobluApp')
.controller('addChannelPagerdutyController', function($scope, $state, $stateParams, nodeType, AuthService, userService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.savePagerdutyApi(nodeType.channelid, $scope.newChannel.token, function(){
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
