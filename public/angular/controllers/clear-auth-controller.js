angular.module('octobluApp')
.controller('clearAuthController', function(OCTOBLU_API_URL, $scope, userService, channelService, AuthService) {
  'use strict';

  $scope.clearAllAuthorizedChannels = function(){
    AuthService.getCurrentUser().then(function(currentUser){
      channelService.getActiveChannels().then(function(activeChannels){
        async.each(activeChannels, function(channel, cb){
          userService.removeConnection(currentUser.resource.uuid, channel._id, function (data) {
            cb();
          });
        }, function(){
          $scope.channelsCleared = true;
        });
      });
    });
  };
});
