angular.module('octobluApp')
.controller('DeviceDetailController', function ($modal, $log, $scope, $state, $stateParams, currentUser, myDevices, availableNodeTypes, PermissionsService, deviceService, NodeService, NodeTypeService) {
  'use strict';

  var device = _.findWhere(myDevices, { uuid: $stateParams.uuid });
  $scope.device = device;

  PermissionsService
  .allSourcePermissions($scope.device.uuid)
  .then(function (permissions) {
    $scope.sourcePermissions = permissions;
  });

  PermissionsService
  .flatSourcePermissions($scope.device.uuid)
  .then(function (permissions) {
    $scope.sourceGroups = _.uniq(permissions, function (permission) {
      return permission.uuid;
    });
  });

  PermissionsService
  .flatTargetPermissions($scope.device.uuid)
  .then(function (permissions) {
    $scope.targetGroups = _.uniq(permissions, function (permission) {
      return permission.uuid;
    });
  });

  PermissionsService
  .allTargetPermissions($scope.device.uuid)
  .then(function (permissions) {
    $scope.targetPermissions = permissions;
  });

  $scope.multipleNames = function (permission) {
    return (permission.name instanceof Array);
  };

  $scope.getDisplayName = function(resource) {
    if(resource.properties) {
      resource = resource.properties;
    }
    return resource.name || resource.displayName || resource.email || 'unknown';
  };

  $scope.deleteDevice = function (device) {
    $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?', function () {
      deviceService.unregisterDevice(device)
      .then(function (devices) {
        $state.go('ob.connector.nodes.all', {}, {reload : true});
      }, function (error) {
        console.error(error);
      });
    });
  };

  $scope.saveDevice = function (device) {
    deviceService.updateDevice(device)
    .then(null, function (error) {
      console.error(error);
    });
  };
});
