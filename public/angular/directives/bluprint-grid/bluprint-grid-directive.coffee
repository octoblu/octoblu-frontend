angular.module('octobluApp')
.directive 'bluprintGrid', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/bluprint-grid/bluprint-grid.html'
    replace: true
    controller: 'BluprintGridController'
    controllerAs: 'controller'
    scope: {
      bluprints: '='
    }
  }
