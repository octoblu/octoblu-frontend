angular.module('octobluApp')
.directive 'thingLogoCell', ->
  restrict: 'A'
  replace: true
  controller: 'ThingLogoCellController'
  controllerAs: 'controller'
  templateUrl: '/pages/thing-logo-cell.html'
