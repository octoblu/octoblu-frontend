angular.module('octobluApp')
.directive 'flowGrid',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/flow-grid/flow-grid.html'
    controller: 'FlowGridController'
    controllerAs: 'controller'
    replace: true
    scope: {
      limit: '@'
      showadd: '@'
    }
  }
