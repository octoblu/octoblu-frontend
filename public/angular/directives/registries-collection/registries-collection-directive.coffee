angular.module('octobluApp')
.directive 'registriesCollection', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/registries-collection/registries-collection.html'
    replace: true
    controller: 'RegistriesCollectionController'
    scope: {
      registries: '='
    }
  }
