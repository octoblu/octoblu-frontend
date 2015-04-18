
angular.module('octobluApp')
.controller('addChannelEchoSignController', function(OCTOBLU_API_URL, $scope, $window, nodeType, channelService) {
  'use strict';

  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(){
    return OCTOBLU_API_URL + '/api/echosign/auth?apiKey=' + $scope.apiKey;
  };

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = getPath();
    });
  };
});
