angular.module('octobluApp')
.directive 'deviceCollection',  ($window) ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/device-collection/device-collection.html'
    replace: true
    transclude: true
    controller: 'DeviceCollectionController'
    scope: {
      devices: '='
      categoryFilter: '='
      loading: '='
      nameFilter: '@'
      activeTab: '='
    }
  }
