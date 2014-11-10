'use strict';

angular.module('octobluApp')
.controller('addChannelCloudDotComController', function($scope, $state, currentUser, nodeType, userService) {
  $scope.activate = function(){
    userService.saveCloudDotComApi(currentUser.skynet.uuid, nodeType.channelid, 
     $scope.newChannel.user, $scope.newChannel.pass,
     function () {
      $state.go('design');
    });
  };
});
