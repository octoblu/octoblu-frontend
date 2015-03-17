'use strict';

angular.module('octobluApp')
.controller('SignupController', function($scope, $state, $location, AuthService) {
  $state.go('login');
});
