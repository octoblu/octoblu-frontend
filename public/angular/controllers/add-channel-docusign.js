'use strict';

angular.module('octobluApp')
.controller('addChannelDocuSignController', function($scope, $state, currentUser, nodeType, userService) {
  $scope.activate = function(){
    userService.saveBasicApi(currentUser.skynetuuid, nodeType.channelid,
     $scope.newChannel.user, $scope.newChannel.pass,
     function () {
      $state.go('design');
    });
  };
});
