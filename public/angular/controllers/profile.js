'use strict';

angular.module('octobluApp')
    .controller('profileController', function ($rootScope, $scope, AuthService, TemplateService) {

      $scope.refreshTemplates = function(){
        TemplateService.withUserUUID($scope.currentUser.skynet.uuid).then(function(templates) {
          $scope.templates = templates;
        });
      };

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

      $scope.refreshTemplates();
    });
