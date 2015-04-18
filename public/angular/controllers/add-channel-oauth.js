'use strict';

angular.module('octobluApp')
.controller('addChannelOauthController', function(OCTOBLU_API_URL, $scope, $window, nodeType, channelService) {
  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(channel){
    return OCTOBLU_API_URL + '/api/oauth/' + channel.type.replace('channel:', '');
  };

  $scope.activate = function(){
    channelPromise.then(function(channel){
      $window.location.href = getPath(channel);
    });
  };
});
