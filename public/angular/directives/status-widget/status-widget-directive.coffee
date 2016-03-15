angular.module('octobluApp')
.directive 'statusWidget',  () ->
  {
    restrict: 'E'
    controller: 'StatusWidgetController'
    controllerAs: 'controller'
    templateUrl: '/angular/directives/status-widget/status-widget.html'
    replace: true
    scope : {}
  }
