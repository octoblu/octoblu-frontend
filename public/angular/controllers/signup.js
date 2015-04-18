'use strict';

angular.module('octobluApp')
.controller('SignupController', function(OCTOBLU_API_URL, $scope, $state, $location, AuthService) {
  $state.go('login');
});
