'use strict';

angular.module('octobluApp')
.controller('addChannelAWSController', function($scope, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveAWSApi(user.resource.uuid, nodeType.channelid,
       $scope.newChannel.user, $scope.newChannel.pass,
       function () {
        $state.go('material.design');
      });
    });
  };
});
