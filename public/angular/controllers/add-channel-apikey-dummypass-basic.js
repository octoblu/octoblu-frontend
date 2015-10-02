'use strict';

angular.module('octobluApp')
.controller('addChannelApiKeyDummyPassBasicController', function($scope, $state, stateParams, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
       $scope.newChannel.apiKey, 'XX',
       function(){
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
