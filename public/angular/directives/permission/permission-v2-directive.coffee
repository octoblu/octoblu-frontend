angular.module('octobluApp')
.directive 'permissionV2',  ($window) ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/permission/permission-v2.html'
    scope:
      type: '='
      list: '='
      onDelete: '='
  }
