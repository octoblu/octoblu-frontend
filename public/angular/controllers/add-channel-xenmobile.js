
angular.module('octobluApp')
.controller('addChannelXenMobileController', function(OCTOBLU_API_URL, $scope, $window, nodeType, channelService) {
  'use strict';

  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(){
    return OCTOBLU_API_URL + '/api/xenmobile/auth?username=' + $scope.username + '&password=' + $scope.password + '&hostname=' + $scope.serverUrl;
  };

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = getPath();
    });
  };
});
