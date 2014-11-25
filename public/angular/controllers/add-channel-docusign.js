angular.module('octobluApp')
.controller('addChannelDocuSignController', function($scope, $state, nodeType, userService, AuthService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveBasicApi(user.resource.uuid, nodeType.channelid,
        $scope.newChannel.user, $scope.newChannel.pass,
        function () {
          $state.go('material.design');
      });
    });
  };
});
