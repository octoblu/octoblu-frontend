'use strict';

angular.module('octobluApp')
.controller('addChannelOauthController', function($scope, $window, nodeType, channelService) {
  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(channel){
    return '/api/oauth/' + channel.type.replace('channel:', '');
  };

  $scope.activate = function(){
    channelPromise.then(function(channel){
      $window.location.href = getPath(channel);
    });
  }
});
