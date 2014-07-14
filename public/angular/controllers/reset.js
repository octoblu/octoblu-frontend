'use strict';

angular.module('octobluApp')
    .controller('resetController', function($scope, $state, $stateParams, $location, AuthService) {
      $scope.resetPassword = function(){
        $scope.errorMessage = undefined;

        if($scope.password !== $scope.confirmPassword) {
          return $scope.errorMessage = 'Passwords must match.'
        }

        AuthService.setPassword($state.params.resetToken, $scope.password).then(function(result){
          $state.go('login');
        }, function(error){
          $scope.errorMessage = 'Could not reset your password.';
        });
      }
    });
