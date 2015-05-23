angular.module('octobluApp')
.directive 'nodeCollection',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/pages/node-collection.html',
    replace: true
  }
