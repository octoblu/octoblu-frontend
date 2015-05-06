angular.module('octobluApp')
.directive 'flowDetailEditor',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/pages/flow-detail-editor.html',
    replace: true,
    transclude: true,
    scope: flow: '='
  }
