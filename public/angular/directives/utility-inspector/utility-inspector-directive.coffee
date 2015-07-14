angular.module('octobluApp')
.directive 'utilityInspector',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/angular/directives/utility-inspector/utility-inspector.html',
    replace: true,
    transclude: true,
    controller : 'UtilityInspectorController',
    controllerAs : 'controller',
    scope:
      flow: '='
      debug: '='
  }
