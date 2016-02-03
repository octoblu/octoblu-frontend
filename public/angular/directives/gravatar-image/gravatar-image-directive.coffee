angular.module('octobluApp')
.directive 'gravatarImage', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/gravatar-image/gravatar-image.html'
    controller: 'GravatarImageController'
    controllerAs: 'controller'
    replace: true
    scope: {
      email: '='
      size: '='
    }
  }
