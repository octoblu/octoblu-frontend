angular.module('octobluApp')
.directive 'flowDebugBrowser',  ($window) ->
  restrict: 'E'
  templateUrl: '/pages/flow-debug-browser.html'
  controller: 'FlowDebugBrowserController'
  controllerAs: 'debugEditor'
  replace: true
  scope: false
