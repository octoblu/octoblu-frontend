angular.module('octobluApp')
.directive 'spinner',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/spinner/spinner.html'
    replace: true
    scope : {
      loading : '='
    }
  }
