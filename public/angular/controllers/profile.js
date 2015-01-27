'use strict';

angular.module('octobluApp')
.controller('profileController', function ($rootScope, $scope, AuthService, NotifyService) {

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
    NotifyService.confirm({
          title: 'Reset your token',
          content: 'Resetting your token will cause mobile apps, and possibly others authenticated as you, to stop working. Are you sure you want to do this?'
        }).then(function(){
          return AuthService.resetToken();
        }).then(function(token){
            NotifyService.alert({title: 'Token Reset', content: token });
        }).catch(function(){
            NotifyService.alert({title: 'Error Resetting Token', content: 'There was an error resetting your token. Please try again.'});
        })
  };

});
