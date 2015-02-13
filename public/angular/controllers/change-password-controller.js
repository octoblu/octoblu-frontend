'use strict';

angular.module('octobluApp')
.controller('ChangePasswordController', function ($rootScope, $scope, AuthService, NotifyService, skynetService, deviceService, $mdDialog) {

  $scope.cancel = function() {
    $mdDialog.hide();
  };

  $scope.changePassword = function(){
    if ($scope.newPassword !== $scope.confirmNewPassword) {
      $scope.passwordError = 'Your new passwords must match';
      return;
    }
    if ($scope.newPassword === $scope.oldPassword) {
      $scope.passwordError = 'New password should be different than old password';
      return;
    }
    $scope.passwordError = false;
    AuthService.updatePassword($scope.oldPassword, $scope.newPassword).then(function(){
      $mdDialog.hide();
      NotifyService.notify('Your password was successfully changed.');
    })
    .catch(function(){
      $scope.passwordError = 'Unable to update your password';
    });
  };
});
