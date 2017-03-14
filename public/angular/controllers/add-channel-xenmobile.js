
angular.module('octobluApp')
.controller('addChannelXenMobileController', function(OCTOBLU_API_URL, $scope, $window, nodeType, channelService, AuthService) {
  'use strict';

  var getPath, currentUserPromise;
  getPath = function(serverUrl){
    var params = $.param({
      username:  $scope.username,
      password:  $scope.password,
      serverUrl: serverUrl
    });
    return OCTOBLU_API_URL + '/api/xenmobile/auth?' + params;
  };

  currentUserPromise = AuthService.getCurrentUser(true);

  $scope.activate = function(){
    currentUserPromise.then(function(user){
      var api, hostname, port, serverUrl;

      api       = _.find(user.api, {type: 'channel:xenmobile'});
      hostname  = api.defaultParams[':hostname'];
      port      = api.defaultParams[':port'];
      serverUrl = hostname + ':' + port;
      $window.location.href = getPath(serverUrl);
    });
  };
});
