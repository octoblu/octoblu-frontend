
angular.module('octobluApp')
.controller('addChannelDatadogController', function(OCTOBLU_API_URL, $scope, $window, nodeType, channelService) {
  'use strict';

  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(){
    return OCTOBLU_API_URL + '/api/datadog/auth?apiKey=' + $scope.apikey + '&appKey=' + $scope.appKey;
  };

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = getPath();
    });
  };
});
