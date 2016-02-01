angular.module('octobluApp')
  .directive 'deviceMissing', ->
    restrict: 'E'
    templateUrl: '/angular/directives/device-missing/device-missing.html'
    replace: true
