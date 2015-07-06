'use strict';

angular.module('octobluApp')
.controller('apiController', function ($scope, $stateParams, $modal, $state, $mdDialog, channelService, userService, NotifyService) {

  channelService.getById($stateParams.id).then(function(channel){
    $scope.channel = channel;
  })

  $scope.setDeactivate = function (ev) {
    $mdDialog.show({
      parent: angular.element(document.querySelector('ui-view')),
      templateUrl: 'myModalContent.html',
      targetEvent: ev,
      controller: function($scope, $mdDialog) {
        $scope.ok = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.respond = function(response) {
          $mdDialog.hide(response);
        }
      }
    })
    .then(function (response) {
      if (response !== 'ok') {
        return;
      }

      userService.removeConnection($scope.channel._id).then(function(){
        $scope.has_user_channel = false;
        channelService.getActiveChannels(true);
        channelService.getAvailableChannels(true);
        _.defer($state.go, 'material.nodewizard.addnode');
        NotifyService.notify('Channel deleted');
      });
    });
  };
});
