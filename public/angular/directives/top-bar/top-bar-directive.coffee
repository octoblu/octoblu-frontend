angular.module('octobluApp')
.directive 'topBar',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/top-bar/top-bar.html'
    controller: 'TopBarController'
    controllerAs: 'controller'
    replace: true
    transclude: true
    scope : {}
  }
