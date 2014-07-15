'use strict';

angular.module('octobluApp')
    .controller('resetController', function($scope, $state, $location, AuthService) {
      $scope.passwordHasBeenReset = false;

      $scope.resetPassword = function(){
        $scope.errorMessage = undefined;

        if($scope.password !== $scope.confirmPassword) {
          return $scope.errorMessage = 'Passwords must match.'
        }

        AuthService.setPassword($state.params.resetToken, $scope.password).then(function(result){
          $scope.passwordHasBeenReset = true;
        }, function(error){
          $scope.errorMessage = error.error || 'Could not reset your password.';
        });
      }
      $scope.gotoLogin = function(){
        $state.go('login');
      }
    });
