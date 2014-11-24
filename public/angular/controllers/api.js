'use strict';

angular.module('octobluApp')
.controller('apiController', function ($scope, $stateParams, $modal, $state, channelService, userService) {

  channelService.getById($stateParams.id).then(function(channel){
    $scope.channel = channel;
  })

  $scope.setDeactivate = function () {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close('ok');
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      }
    });

    modalInstance.result.then(function (response) {
      if (response !== 'ok') {
        return;
      }

      userService.removeConnection($scope.channel._id).then(function(){
        $scope.has_user_channel = false;
        channelService.getActiveChannels(true);
        channelService.getAvailableChannels(true);
        _.defer($state.go, 'material.nodes');
      });
    });
  };
});
