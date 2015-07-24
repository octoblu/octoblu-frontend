'use strict';

angular.module('octobluApp')
.controller('profileController', function ($rootScope, $scope, AuthService, NotifyService, $mdDialog, skynetService, deviceService, ThingService) {

  AuthService.getCurrentUser().then(function(user){
    $scope.currentUser = user;
  });

  var refreshDevice = function(){
    skynetService.getSkynetConnection().then(function (skynetConnection) {
      skynetConnection.whoami({}, function(user) {
        $scope.device = user;
        $scope.tokens = user.meshblu.tokens;
        window.user = user;
        $scope.$digest();
      });
    });
  };

  refreshDevice();

  $scope.hasTokens = function(){
    return !(_.isEmpty($scope.tokens));
  };

  $scope.confirmDeleteToken = function(token){
    NotifyService.confirm({
      title: 'Delete Session',
      content: 'Deleting this session will cause mobile apps and other apps using that authorization to stop working. Are you sure you want to do this?'
    }).then(function(){
      deleteToken(token);
    });
  };

  var deleteToken = function(token) {
    $scope.device.meshblu.tokens = _.omit($scope.tokens, token);
    $scope.tokens = $scope.device.meshblu.tokens;
    deviceService.updateDevice($scope.device);
  };

  $scope.generateSessionToken = function() {
    ThingService.generateSessionToken($scope.device).then(function(token){
      var alertOptions = {
        title: 'New Session Token',
        content: token,
        ok: 'Dismiss'
      };

      $mdDialog.show($mdDialog.alert(alertOptions).clickOutsideToClose(false));
      refreshDevice();
    });
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
