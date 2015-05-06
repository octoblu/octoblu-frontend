angular.module('octobluApp')
.directive 'flowInspector',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/pages/flow-inspector.html',
    replace: true,
    transclude: true,
    scope: flow: '='
  }
