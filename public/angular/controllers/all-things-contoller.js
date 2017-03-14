angular.module('octobluApp')
.controller('AllThingsController', function($scope, NotifyService, RegistryService, NodeTypeService) {
  'use strict';
  var registries = {}
  var devices = [];

  $scope.allItems = [];
  $scope.itemsByCategory = {};

  $scope.loading = true;

  NodeTypeService.getNodeTypes()
    .then(function(newDevices) {
      devices = newDevices;
      RegistryService.getRegistries()
        .then(function(newRegistries) {
          registries = newRegistries
          $scope.loading = false;
          updateItems(_.cloneDeep(devices), _.cloneDeep(registries))
        }, function(error) {
          NotifyService.notifyError(error)
          $scope.loading = false;
        })
    }, function(error) {
      NotifyService.notifyError(error)
      $scope.loading = false;
    });


  function filterCollection(items, filterByName) {
    return _.filter(items, function(item){
      var name = (item.name || '').toLowerCase();
      return _.includes(name, filterByName);
    });
  }

  $scope.$watch('filterByName', function(filterByName) {
    filterByName = (filterByName || '').toLowerCase();
    var filteredDevices = filterCollection(devices, filterByName)
    var filteredRegistries = _.cloneDeep(RegistryService.filterBy('name', filterByName))
    updateItems(filteredDevices, filteredRegistries);
  });

  var updateItems = function(filteredDevices, filteredRegistries) {
    $scope.allItems = filteredDevices
    _.each(_.values(filteredRegistries), function(registryType) {
      _.each(_.values(registryType), function(registry) {
        _.each(registry.items, function(item) {
          item.useCreateUri = true
          $scope.allItems.push(item)
        })
      })
    })
    $scope.itemsByCategory = _.groupBy($scope.allItems, 'categories')
  };
});
