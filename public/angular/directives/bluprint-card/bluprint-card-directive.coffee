angular.module('octobluApp')
.directive 'bluprintCard', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/bluprint-card/bluprint-card.html'
    replace: true
    controller: 'BluprintCardController'
    controllerAs: 'controller'
  }
