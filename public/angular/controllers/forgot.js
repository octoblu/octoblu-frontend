'use strict';

angular.module('octobluApp')
    .controller('forgotController', function(OCTOBLU_API_URL, $scope, $location, AuthService) {
      $scope.resetPassword = function(){
        AuthService.resetPassword($scope.email).then(function(){
          $scope.successMessage = 'We a reset password link to: ' + $scope.email;
          delete $scope.errorMessage;
        }, function(){
          delete $scope.successMessage;
          $scope.errorMessage = 'Could not find a user associated with this email';
        });
      }
    });
