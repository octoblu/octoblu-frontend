'use strict';

angular.module('octobluApp')
.controller('addChannelOauthController', function($scope, $window, nodeType, channelService) {
  var channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    channelPromise.then(function(channel){

      var url = '/api/auth/';

      if (channel.owner || channel.useCustom) {
        url = url + channel._id + '/custom';
      } else {
        url = url + channel.name;
      }

      $window.location.href = url;
    });
  }
});
