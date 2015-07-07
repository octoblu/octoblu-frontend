angular.module('octobluApp')
.controller('addNodeController', function($scope, NodeTypeService) {
  'use strict';

  $scope.devices = [];
  $scope.deviceCategories = ["device", "channel", "microblu"];
  $scope.loading = true;

  NodeTypeService.getNodeTypes().then(function(devices){
    $scope.devices = devices;
    $scope.categories = {};

    _.map($scope.deviceCategories, function(category){
      $scope.categories[category] = {};
      $scope.categories[category].devices = [];
      $scope.categories[category].label = category;
      $scope.categories[category].devices = _.filter(devices, function(device) {
        return device.category === category;
      });
    });

    $scope.loading = false;
  });

  $scope.isAvailable = function (node) {
    if (node.category === 'device' || node.category === 'microblu') {
      return node.resource.online;
    }
    return true;
  };
});
