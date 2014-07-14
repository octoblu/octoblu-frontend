'use strict';

angular.module('octobluApp')
    .controller('profileController', function ($rootScope, $scope, AuthService) {
      $scope.formIsValid = false;
      $scope.errors = {};

      $scope.updatePassword = function(){
        AuthService.updatePassword($scope.oldPassword, $scope.newPassword).then(function(result){
          $scope.successMessage = 'Your password has been updated.';
        }, function(error){
          $scope.errorMessage = error.error || 'Could not reset your password.';
        });
      };

      $scope.validateConfirmPassword = function(passwordForm) {
          passwordForm.confirmNewPassword.$setValidity('matches', $scope.newPassword === $scope.confirmNewPassword);
      };
    });
