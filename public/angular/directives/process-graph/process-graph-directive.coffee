angular.module('octobluApp')
.directive 'processGraph',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/process-graph/process-graph.html'
    controller: 'ProcessGraphController'
    controllerAs: 'controller'
    replace: true
  }
