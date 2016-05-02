angular.module('octobluApp')
.directive 'flowPermissionManager',  () ->
  {
    replace: true
    restrict: 'E'
    templateUrl: '/angular/directives/flow-permission-manager/flow-permission-manager.html'
    controller: 'FlowPermissionManagerController'
    controllerAs: 'controller'
    scope:
      flow: '='
  }
