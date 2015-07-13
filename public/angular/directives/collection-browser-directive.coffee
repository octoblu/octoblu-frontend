angular.module('octobluApp')
.directive 'collectionBrowser',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/pages/utility-inspector.html',
    replace: true,
    transclude: true,
    controller : 'CollectionBrowserController',
    controllerAs : 'controller',
    scope:
      flow: '='
      debug: '='
  }
