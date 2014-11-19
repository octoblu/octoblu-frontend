angular.module('octobluApp')
.controller('MaterialController', function($rootScope, $scope, $http, $injector) {
  'use strict';

  $scope.toggleNav = function() {
    $scope.navIsOpen = !$scope.navIsOpen;
  };
});
