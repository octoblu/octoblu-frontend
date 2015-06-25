angular.module('octobluApp')
.directive 'collectionBrowser',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/pages/collection-browser.html',
    replace: true,
    transclude: true,
    controller : 'CollectionBrowserController',
    controllerAs : 'controller',
  }
