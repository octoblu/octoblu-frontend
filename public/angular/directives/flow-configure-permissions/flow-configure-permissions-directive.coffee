angular.module('octobluApp')
.directive 'flowConfigurePermissions', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/flow-configure-permissions/flow-configure-permissions.html'
    replace: true
    controller: 'FlowConfigurePermissionsController'
    controllerAs: 'controller'
    scope: {
      flow: '='
    }
  }
