angular.module('octobluApp')
.directive 'topNav',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/top-nav/top-nav.html'
    replace: true
    transclude: true
    scope : {}
  }
