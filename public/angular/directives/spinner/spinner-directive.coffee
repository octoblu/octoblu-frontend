angular.module('octobluApp')
.directive 'daLoading',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/da-loading/da-loading.html'
    replace: true
    scope : {
      loading : '='
    }
  }
