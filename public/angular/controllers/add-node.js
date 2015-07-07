angular.module('octobluApp')
.controller('addNodeController', function(OCTOBLU_API_URL, OCTOBLU_ICON_URL, $scope, $state, $stateParams, NodeTypeService) {
  'use strict';

  $scope.devices = [];
  $scope.deviceCategories = ["device", "channel", "microblu"];
  $scope.loading = true;

  NodeTypeService.getNodeTypes().then(function(devices){
    $scope.devices = devices;
    $scope.loading = false;
  });

  $scope.isAvailable = function (node) {
    if (node.category === 'device' || node.category === 'microblu') {
      return node.resource.online;
    }
    return true;
  }
});
