angular.module('octobluApp')
.directive 'bluSearch', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/blu-search/blu-search.html'
    replace: true
    scope: {
      placeholder: '@'
      searchModel: '='
    }
  }
