angular.module('octobluApp')
.controller('clearAuthController', function($scope, userService, channelService, currentUser) {
  'use strict';

  $scope.clearAllAuthorizedChannels = function(){
    channelService.getActiveChannels().then(function(activeChannels){
      async.each(activeChannels, function(channel, cb){
        userService.removeConnection(currentUser.skynet.uuid, channel._id, function (data) {
          cb();
        });
  }, function(){
        $scope.channelsCleared = true;
      });
    });
  };
});
