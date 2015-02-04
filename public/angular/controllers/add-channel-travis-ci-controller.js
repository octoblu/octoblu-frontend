
angular.module('octobluApp')
.controller('addChannelTravisCIController', function($scope, $window, nodeType, channelService) {
  'use strict';

  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = '/api/travis-ci/auth';
    });
  };
});
