class DevicePermissionListItemController
  getPermissionClass: (permission) =>
    return 'fa fa-check-circle has-permission' if permission
    'fa fa-exclamation-circle no-permission'

angular.module('octobluApp').controller 'DevicePermissionListItemController', DevicePermissionListItemController
