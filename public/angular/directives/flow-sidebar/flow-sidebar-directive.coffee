angular.module('octobluApp')
.directive 'flowSidebar', ->
  {
    restrict: 'E',
    templateUrl: '/angular/directives/flow-sidebar/flow-sidebar.html',
    replace: true,
    transclude: true,
    scope:
      flow: '='
      expandedState: '='
      debug: '='
  }
