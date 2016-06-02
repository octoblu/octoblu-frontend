angular.module('octobluApp')
.directive 'permissionsV2',  ($window) ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/permissions/permissions-v2.html'
    controller: "PermissionsV2Controller"
    controllerAs: 'controller'
    scope:
      thing: '='
  }
