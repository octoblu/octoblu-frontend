angular.module('octobluApp')
.directive 'flowCollection',  ($window) ->
  {
    restrict: 'E',
    templateUrl: '/pages/flow-collection.html',
    replace: true
  }
