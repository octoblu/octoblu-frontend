angular.module('octobluApp')
.directive 'flowSidebar', ->
  {
    restrict: 'E',
    templateUrl: '/pages/sidebar.html',
    replace: true,
    transclude: true,
    scope:
      flow: '='
      expandedState: '='
  }
