'use strict';

angular.module('octobluApp')
.controller('addChannelApiKeyBasicController', function($scope, $state, currentUser, nodeType, userService) {
  $scope.activate = function(){
    userService.saveBasicApi(currentUser.skynet.uuid, nodeType.channelid,
     $scope.newChannel.apiKey, '',
     function () {
      $state.go('design');
    });
  };
});
