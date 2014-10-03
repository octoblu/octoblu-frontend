'use strict';

angular.module('octobluApp')
  .controller('addChannelMeshbluController', function($scope, $state, currentUser, nodeType, userService) {
    $scope.activate = function(){
      userService.saveBasicApi(currentUser.skynetuuid, nodeType.channelid,
        currentUser.skynetuuid, currentUser.skynettoken,
        function () {
          $state.go('design');
        });
    };
  });