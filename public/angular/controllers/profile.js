'use strict';

angular.module('octobluApp')
.controller('profileController', function ($rootScope, $scope, AuthService, NotifyService, $mdDialog, skynetService, deviceService) {

  AuthService.getCurrentUser().then(function(user){
    $scope.currentUser = user;
  });

  $scope.tokens = [];

  skynetService.getSkynetConnection().then(function (skynetConnection) {
    skynetConnection.whoami({}, function(data) {
      $scope.device = data;
      $scope.tokens = data.tokens || [];
      $scope.$digest();
    });
  });

  $scope.confirmDeleteToken = function(token){
    NotifyService.confirm({
      title: 'Delete Session',
      content: 'Deleting this session will cause mobile apps and other apps using that authorization to stop working. Are you sure you want to do this?'
    }).then(function(){
      $scope.deleteToken(token);
    });
  };

  $scope.deleteToken = function(token) {
    $scope.device.tokens = _.without($scope.tokens, token);
    $scope.tokens = $scope.device.tokens;
    deviceService.updateDevice($scope.device);
  };

  $scope.resetToken = function(){
    NotifyService.confirm({
          title: 'Reset your token',
          content: 'Resetting your token will cause mobile apps and other apps authenticated as you, to stop working. Are you sure you want to do this?'
        }).then(function(){
          return AuthService.resetToken();
        }).then(function(token){
            NotifyService.alert({title: 'Token Reset', content: token });
        }).catch(function(error){
            if(error){
            NotifyService.alert({title: 'Error Resetting Token', content: 'There was an error resetting your token. Please try again.'});
            }
        });
  };

  $scope.changePassword = function(event) {
    $mdDialog.show({
      controller: 'ChangePasswordController',
      templateUrl: '/pages/change-password.html',
      targetEvent: event,
    })
  };

});
