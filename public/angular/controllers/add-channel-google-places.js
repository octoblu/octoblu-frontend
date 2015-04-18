'use strict';

angular.module('octobluApp')
.controller('addChannelGooglePlacesController', function(OCTOBLU_API_URL, $scope, $state, nodeType, userService, AuthService) {

  $scope.activate = function(){    
    AuthService.getCurrentUser().then(function(user){
      userService.saveGooglePlacesApi(user.resource.uuid, nodeType.channelid, $scope.newChannel.apikey, function () {
        $state.go('material.design');
      });
    });
  };
});
