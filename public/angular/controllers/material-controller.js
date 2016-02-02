angular.module('octobluApp')
.controller('MaterialController', function($scope, $state, AuthService) {
  'use strict';

  AuthService.getCurrentUser().then(function(user){
    $scope.isCWCEnabled = user.userDevice.workspaceCloudUser
  })

  $scope.logout = function(){
    console.log("logging out...");
    // AuthService.logout().then(function () {
    //   $state.go('login');
    // });
  };
});
