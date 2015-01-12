'use strict';

angular.module('octobluApp')
.controller('addChannelTeslaController', function($scope, $state, $http, nodeType, userService, channelService, AuthService) {
  var channelPromise;

  channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    var profile = { username: $scope.newChannel.user, password : $scope.newChannel.pass };
    channelPromise.then(function(channel){
      $http.post('/api/tesla/auth', profile).then(function(){
        $state.go('material.design');
      })
    })
  };
});
