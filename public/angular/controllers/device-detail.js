angular.module('octobluApp')
.controller('DeviceDetailControllerOld', function ($modal, $log, $scope, $state, device, PermissionsService, deviceService, NotifyService) {
  'use strict';
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
      .then(function () {
        $state.go('material.nodes');
        NotifyService.notify('Device deleted');
      }, function (error) {
        NotifyService.notify('Error deleting device');
      });
    });
  };

  $scope.saveDevice = function (device) {
    deviceService.updateDevice(device)
      .then(function(){
        NotifyService.notify('Device updated');
      },
       function (error) {
        NotifyService.notify('Error updating device');
      });
  };

  $scope.resetToken = function(){
    $scope.confirmModal($modal, $scope, $log, 'Reset token for ' + device.name, 'Resetting your token will invalidate the existing token. Are you sure?', function(){

        deviceService.resetToken(device.uuid)
          .then(function (token) {
              NotifyService.alert({title:'Token Reset', content: token});
            },
            function (error) {
              NotifyService.notify('Error resetting token');
        });
    });
  };
});
