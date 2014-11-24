'use strict';

angular.module('octobluApp')
.controller('processController', function ($scope, channelService, userService, NodeService, AuthService) {
  $scope.message = 'Contact page content pending.';
  var dataPoints = [];
  var deviceData = [];
  var chart;

  channelService.getActive(function (data) {
      $scope.channels = data;
  });

  AuthService.getCurrentUser().then(function(currentUser){
    userService.getMessageGraph(currentUser.resource.uuid, 'now-30d/d', 'day', function (data) {
        $scope.messages = data
    });
  });

  NodeService.getNodes({cache: false}).then(function(myDevices){
    $scope.devices = myDevices;
  });
});
