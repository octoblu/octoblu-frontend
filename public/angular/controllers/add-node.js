angular.module('octobluApp')
.controller('addNodeController', function($scope, NotifyService, RegistryService, NodeTypeService) {
  'use strict';
  var devices = [];
  var registries = {};
  $scope.devicesByCategory = {};

  $scope.loadingThings = true;
  $scope.loadingRegistries = true;
  $scope.hasResults = false;

  NodeTypeService.getNodeTypes().then(function(newDevices) {
    devices = newDevices;

    $scope.loadingThings = false;
    updateDevicesByCategory(devices);
  });

  RegistryService.getRegistries()
    .then(function(newRegistries) {
      registries = newRegistries
      updateRegistries(registries)
      $scope.loadingRegistries = false;
    }, function(error) {
      NotifyService.notifyError(error)
      $scope.loadingRegistries = false;
    })

  function filterCollection(items, filterByName) {
    return _.filter(items, function(item){
      var name = (item.name || '').toLowerCase();
      return _.contains(name, filterByName);
    });
  }

  $scope.$watch('devices', setHasResults)
  $scope.$watch('registries', setHasResults)

  $scope.$watch('filterByName', function(filterByName) {
    filterByName = (filterByName || '').toLowerCase();
    updateDevicesByCategory(filterCollection(devices, filterByName));
    updateRegistries(RegistryService.filterBy('name', filterByName));
  });

  $scope.isAvailable = function (node) {
    if (node && node.resource) {
      return node.resource.online;
    }
    return true;
  };

  function setHasResults() {
    var hasItems = RegistryService.hasItems($scope.registries)
    if (hasItems) {
      $scope.hasResults = true
      return
    }
    $scope.hasResults = !_.isEmpty($scope.devices)
  }

  var updateDevicesByCategory = function(devices) {
    $scope.devices = devices;
    $scope.devicesByCategory = _.groupBy(devices, 'categories')
  };

  var updateRegistries = function(registries) {
    $scope.registries = registries;
  };

});
