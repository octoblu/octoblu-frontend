'use strict';

angular.module('octobluApp')
.controller('addChannelAWSController', function($scope, $state, currentUser, nodeType, userService) {
  $scope.activate = function(){
    userService.saveAWSApi(currentUser.skynetuuid, nodeType.channelid, 
     $scope.newChannel.user, $scope.newChannel.pass,
     function () {
      $state.go('design');
    });
  };
});
