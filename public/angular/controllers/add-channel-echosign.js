'use strict';

angular.module('octobluApp')
.controller('addChannelEchoSignController', function($scope, $window, nodeType, channelService) {
  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(){
    return '/api/echosign/auth?apiKey=' + $scope.apiKey;
  };

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = getPath();
    });
  };
});
