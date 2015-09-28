angular.module('octobluApp')
.controller('addChannelDocuSignController', function($scope, $state, $stateParams, nodeType, userService, AuthService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
        $scope.newChannel.user, $scope.newChannel.pass,
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
