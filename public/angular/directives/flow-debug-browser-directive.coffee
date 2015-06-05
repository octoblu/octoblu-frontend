angular.module('octobluApp')
.directive 'flowDebugBrowser',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/pages/flow-debug-browser.html',
    replace: true
  }
