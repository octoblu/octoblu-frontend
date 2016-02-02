angular.module('octobluApp')
.directive 'topNav',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/top-nav/top-nav.html'
    controller: 'TopNavController'
    controllerAs: 'controller'
    replace: true
    transclude: true
    scope : {}
  }
