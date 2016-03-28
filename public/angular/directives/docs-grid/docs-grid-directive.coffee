angular.module('octobluApp')
.directive 'docsGrid',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/docs-grid/docs-grid.html'
    controller: 'DocsGridController'
    controllerAs: 'controller'
    replace: true
    scope: {
      limit: '@'
    }
  }
