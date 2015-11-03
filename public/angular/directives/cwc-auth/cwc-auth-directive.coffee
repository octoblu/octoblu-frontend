angular.module('octobluApp')
.directive 'cwcAuth',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/cwc-auth/cwc-auth.html'
    controller: 'CWCAuthController'
    controllerAs: 'controller'
    replace: true
  }
