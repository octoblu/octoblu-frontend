angular.module('octobluApp')
.directive 'devicePermissionListItem',  () ->
  {
    replace: true
    restrict: 'E'
    templateUrl: '/angular/directives/device-permission-list-item/device-permission-list-item.html'
    scope:
      device: '='
      permissions: '='
  }
