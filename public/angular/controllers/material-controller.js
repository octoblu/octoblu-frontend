angular.module('octobluApp')
.controller('MaterialController', function($mdMedia, $scope, $state, AuthService) {
  'use strict';

  AuthService.getCurrentUser().then(function(user){
    $scope.isCWCEnabled = user.userDevice.workspaceCloudUser
  })

  $scope.isNavLockedOpen = function() {
    if($state.is('material.design') || $state.is('material.flow') || $state.is('material.cloud')){
      return false;
    }
    return $mdMedia('gt-lg');
  };

  $scope.toggleNav = function() {
    $scope.navIsOpen = !$scope.navIsOpen;
  };

  $scope.closeNav = function(){
    $scope.navIsOpen = false;
  };

  $scope.logout = function(){
    AuthService.logout().then(function () {
      $state.go('login');
    });
  };
});
