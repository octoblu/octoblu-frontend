angular.module('octobluApp')
.controller('MaterialController', function($scope, $state, AuthService) {
  'use strict';

  AuthService.getCurrentUser().then(function(user){
    $scope.isCWCEnabled = user.userDevice.workspaceCloudUser
  })

});
