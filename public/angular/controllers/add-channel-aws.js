'use strict';

angular.module('octobluApp')
.controller('addChannelAWSController', function($scope, $state, currentUser, nodeType, userService) {
  $scope.activate = function(){
    userService.saveAWSApi(currentUser.skynet.uuid, nodeType.channelid, 
     $scope.newChannel.user, $scope.newChannel.pass,
     function () {
      $state.go('design');
    });
  };
});
