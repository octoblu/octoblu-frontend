angular.module('octobluApp')
.controller('MaterialController', function($mdMedia, $scope, $state, AuthService) {
  'use strict';

  $scope.isNavLockedOpen = function() {
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
