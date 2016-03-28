angular.module('octobluApp')
.directive 'docsGridCard',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/docs-grid-card/docs-grid-card.html'
    controller: 'DocsGridCardController'
    controllerAs: 'controller'
    replace: true
  }
