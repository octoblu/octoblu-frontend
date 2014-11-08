'use strict';

angular.module('octobluApp')
.controller('addChannelBasicController', function($scope, $state, currentUser, nodeType, userService) {
  $scope.activate = function(){
    userService.saveBasicApi(currentUser.skynet.uuid, nodeType.channelid, 
     $scope.newChannel.user, $scope.newChannel.pass,
     function () {
      $state.go('design');
    });
  };
});
