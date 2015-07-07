angular.module('octobluApp')
.directive 'deviceCollection', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/device-collection/device-collection.html'
    replace: true
    controller: 'DeviceCollectionController'
    controllerAs: 'controller'
    scope: {
      devices: '='
      loading: '='
      nameFilter: '@'
      category: '='
    }
  }
