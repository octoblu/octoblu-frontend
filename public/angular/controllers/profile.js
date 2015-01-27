'use strict';

angular.module('octobluApp')
.controller('profileController', function ($rootScope, $scope, AuthService) {

  AuthService.getCurrentUser().then(function(user){
    $scope.currentUser = user;
  });

  $scope.updatePassword = function(passwordForm){
    AuthService.updatePassword($scope.oldPassword, $scope.newPassword).then(function(result){
      $scope.passwordUpdated = true;
      delete $scope.oldPassword;
      delete $scope.newPassword;
      delete $scope.confirmNewPassword;
      passwordForm.$setPristine();
    }, function(result){
      passwordForm.oldPassword.$setValidity('correct', false);
    });
  };

  $scope.validateOldPassword = function(passwordForm) {
    $scope.passwordUpdated = false;
    passwordForm.oldPassword.$setValidity('correct', true);
  }

  $scope.validateConfirmPassword = function(passwordForm) {
    $scope.passwordUpdated = false;
    passwordForm.confirmNewPassword.$setValidity('matches', $scope.newPassword === $scope.confirmNewPassword);
  };

  $scope.resetToken = function(){
    $scope.confirmModal()
  };

});
