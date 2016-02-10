
angular.module('octobluApp')
.controller('addChannelCLMController', function(OCTOBLU_API_URL, $scope, $window, nodeType, channelService) {
  'use strict';

  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(){
    return OCTOBLU_API_URL + '/api/clm/auth?servername=' + $scope.servername + '&apiKey=' + $scope.apikey;
  };

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = getPath();
    });
  };
});
