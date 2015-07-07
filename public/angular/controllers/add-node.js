angular.module('octobluApp')
.controller('addNodeController', function($scope, NodeTypeService) {
  'use strict';
  var devices = [];
  $scope.devicesByCategory = {};

  $scope.loading = true;
  $scope.noDevices = false;

  NodeTypeService.getNodeTypes().then(function(newDevices) {
    devices = newDevices;
    $scope.loading = false;
    updateDevicesByCategory(devices);
  });

  $scope.$watch('nodeNameSearch', function(nodeNameSearch) {
    nodeNameSearch = nodeNameSearch || '';
    var filteredDevices = _.filter(devices, function(device){
      var name = (device.name || '').toLowerCase();
      var search = nodeNameSearch.toLowerCase();
      return _.contains(name, search);
    });

    updateDevicesByCategory(filteredDevices);
  });

  $scope.isAvailable = function (node) {
    if (node.category === 'device' || node.category === 'microblu') {
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
    $scope.devicesByCategory = _.groupBy(devices, 'categories');
  };

});
