'use strict';

angular.module('octobluApp')
.controller('addChannelApiKeyDummyPassBasicController', function($scope, $state, currentUser, nodeType, userService) {
  $scope.activate = function(){
    userService.saveBasicApi(currentUser.skynet.uuid, nodeType.channelid,
     $scope.newChannel.apiKey, 'XX',
     function () {
      $state.go('design');
    });
  };
});
