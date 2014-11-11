'use strict';

angular.module('octobluApp')
  .controller('addChannelMeshbluController', function($scope, $state, currentUser, nodeType, userService) {
    $scope.activate = function(){
      userService.saveBasicApi(currentUser.skynet.uuid, nodeType.channelid,
        currentUser.skynet.uuid, currentUser.skynet.token,
        function () {
          $state.go('design');
        });
    };
  });
