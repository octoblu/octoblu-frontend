'use strict';

angular.module('octobluApp')
.controller('addChannelLittlebitsController', function($scope, $state, $http, nodeType, userService, channelService, AuthService) {
  var channelPromise;

  channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    var profile = { accessToken: $scope.newChannel.accessToken};
    channelPromise.then(function(channel){
      $http.post('/api/littlebits/auth', profile).then(function(){
        $state.go('material.design');
      })
    })
  };
});
