'use strict';

angular.module('octobluApp')
.controller('addChannelWitaiController', function($scope, $state, $http, nodeType, userService, channelService, AuthService) {
  var channelPromise;

  channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    var profile = { accessToken: $scope.newChannel.accessToken};
    channelPromise.then(function(channel){
      $http.post('/api/witai/auth', profile).then(function(){
        $state.go('material.design');
      })
    })
  };
});
