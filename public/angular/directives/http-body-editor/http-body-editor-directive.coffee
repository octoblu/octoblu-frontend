angular.module('octobluApp')
.directive 'httpBodyEditor',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/http-body-editor/http-body-editor.html'
    controller: 'HttpBodyController'
    controllerAs: 'bodyController'
    replace: true
  }
