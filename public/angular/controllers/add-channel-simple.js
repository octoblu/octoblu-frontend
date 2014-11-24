'use strict';

angular.module('octobluApp')
.controller('addChannelSimpleController', function($scope, $state, nodeType, userService, AuthService) {
  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveConnection(user.resource.uuid, nodeType.channelid, undefined, undefined, {},
        function () {
          $state.go('material.channel', {id: nodeType.channelid});
        }
      );
    });
  };
});
