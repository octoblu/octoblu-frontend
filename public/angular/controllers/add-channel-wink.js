'use strict';

angular.module('octobluApp')
.controller('addChannelWinkController', function(OCTOBLU_API_URL, $scope, $state, $stateParams, $http, nodeType, userService, channelService, AuthService) {
  var channelPromise;

  channelPromise = channelService.getById(nodeType.channelid);

  $scope.activate = function(){
    var profile = { username: $scope.newChannel.user, password : $scope.newChannel.pass };
    channelPromise.then(function(channel){
      $http.post(OCTOBLU_API_URL + '/api/wink/auth', profile).then(function(){
        var redirectToDesign = $stateParams.designer || false;
        var redirectToWizard = $stateParams.wizard || false;
        var route = 'material.configure';
        var params = {added: nodeType.name};
        if(redirectToWizard){
          route = 'material.flowConfigure';
          params = {flowId: $stateParams.wizardFlowId};
        }
        if(redirectToDesign){
          route = 'material.design';
        }
        $state.go(route, params);
      })
    });
  };
});
