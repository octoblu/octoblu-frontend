
angular.module('octobluApp')
.controller('addChannelCLMController', function(OCTOBLU_API_URL, $scope, $window, nodeType, channelService) {
  'use strict';

  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);
  getPath = function(){
    return OCTOBLU_API_URL + '/api/clm/auth?servername=' + $scope.servername + '&apiKey=' + encodeURIComponent($scope.apikey) + '&apiSecret=' + encodeURIComponent($scope.apiSecret);
  };

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = getPath();
    });
  };
});
