'use strict';

angular.module('octobluApp')
.controller('addChannelOauthController', function($scope, $window, nodeType, channelService) {
  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(channel){
    if (channel.isPassport) {
      return '/api/oauth/' + channel.name.toLowerCase();
    }
    if (channel.owner || channel.useCustom) {
      return '/api/auth/' + channel._id + '/custom';
    }
    return '/api/auth/' + channel.name;
  };

  $scope.activate = function(){
    channelPromise.then(function(channel){
      $window.location.href = getPath(channel);
    });
  }
});
