'use strict';

angular.module('octobluApp')
.controller('addChannelNoauthController', function ($scope, $state, $stateParams, nodeType, userService, channelService, AuthService) {
  $scope.isLoading = true;
  AuthService.getCurrentUser().then(function(user){
    userService.activateNoAuthChannel(user.resource.uuid, nodeType.channelid, function () {
      channelService.getActiveChannels(true);
      channelService.getAvailableChannels(true);
      var redirectToDesign = $stateParams.designer || false;
      var redirectToWizard = $stateParams.wizard || false;
      var route = 'material.things.my';
      var params = {added: nodeType.name};
      if(redirectToWizard){
        route = 'material.flowConfigure';
        params = {flowId: $stateParams.wizardFlowId, nodeIndex: $stateParams.wizardNodeIndex};
      }
      if(redirectToDesign){
        route = 'material.design';
      }
      $state.go(route, params);
    });
  });
});
