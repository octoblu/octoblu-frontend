angular.module('octobluApp')
.controller('addNodeController', function($scope, NodeTypeService) {
  'use strict';
  var devices = [];
  $scope.devicesByCategory = {};

  $scope.loadingThings = true;
  $scope.noDevices = false;

  NodeTypeService.getNodeTypes().then(function(newDevices) {
    devices = newDevices;

    $scope.loadingThings = false;
    updateDevicesByCategory(devices);
  });

  $scope.$watch('filterByName', function(filterByName) {
    filterByName = filterByName || '';
    var filteredDevices = _.filter(devices, function(device){
      var name = (device.name || '').toLowerCase();
      var search = filterByName.toLowerCase();
      return _.contains(name, search);
    });

    updateDevicesByCategory(filteredDevices);
  });

  $scope.isAvailable = function (node) {
    if (node && node.resource) {
      return node.resource.online;
    }
    return true;
  };

  var updateDevicesByCategory = function(devices) {
    if(!devices.length) {
      $scope.noDevices = true;
    } else {
      $scope.noDevices = false;
    }
    $scope.devices = devices;
    $scope.devicesByCategory = _.groupBy(devices, 'categories');
  };

});
