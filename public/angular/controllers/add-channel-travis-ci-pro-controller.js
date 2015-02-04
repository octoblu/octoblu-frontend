
angular.module('octobluApp')
.controller('addChannelTravisCIProController', function($scope, $window, nodeType, channelService, AuthService) {
  'use strict';

  var channelPromise, getPath;

  channelPromise = channelService.getById(nodeType.channelid);

  AuthService.getCurrentUser().then(function(user){
    $scope.githubIsActive = _.findWhere(user.api, {type: 'channel:github'});
  });

  $scope.activate = function(){
    channelPromise.then(function(){
      $window.location.href = '/api/travis-ci-pro/auth';
    });
  };
});
