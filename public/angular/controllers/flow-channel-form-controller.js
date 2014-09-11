angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope, channelService) {
  'use strict';
  channelService.getById($scope.node.channelid).then(function(channel){
    $scope.resources = channel.application.resources;
  });
});
