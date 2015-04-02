'use strict';

angular.module('octobluApp')
.controller('addChannelNoauthController', function ($scope, $state, nodeType, userService, channelService, AuthService) {
  $scope.activate = function () {
    AuthService.getCurrentUser().then(function(user){
      userService.activateNoAuthChannel(user.resource.uuid, nodeType.channelid, function () {
        channelService.getActiveChannels(true);
        channelService.getAvailableChannels(true);
        $state.go('material.design');
      });
    });
  };
});
