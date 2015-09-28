'use strict';

angular.module('octobluApp')
.controller('addChannelNoauthController', function ($scope, $state, $stateParams, nodeType, userService, channelService, AuthService) {
  $scope.isLoading = true;
  var redirectToDesign = $stateParams.designer || false;
  AuthService.getCurrentUser().then(function(user){
    userService.activateNoAuthChannel(user.resource.uuid, nodeType.channelid, function () {
      channelService.getActiveChannels(true);
      channelService.getAvailableChannels(true);
      if(redirectToDesign){
        $state.go('material.design', {added: nodeType.name});
      }
      else{
        $state.go('material.configure', {added: nodeType.name});
      }
    });
  });
});
