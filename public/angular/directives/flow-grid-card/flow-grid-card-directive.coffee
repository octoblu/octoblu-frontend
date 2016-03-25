angular.module('octobluApp')
.directive 'flowGridCard',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/flow-grid-card/flow-grid-card.html'
    controller: 'FlowGridCardController'
    controllerAs: 'controller'
  }
