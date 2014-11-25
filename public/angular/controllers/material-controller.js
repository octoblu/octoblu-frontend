angular.module('octobluApp')
.controller('MaterialController', function($rootScope, $scope, $http, $injector, AuthService) {
  'use strict';

  $scope.toggleNav = function() {
    $scope.navIsOpen = !$scope.navIsOpen;
  };

  $scope.closeNav = function(){
    $scope.navIsOpen = false;
  };

  $scope.logout = function(){
    AuthService.logout();
  };
});
