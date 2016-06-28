class RegistriesCollectionController
  constructor: ($scope, RegistryService) ->
    @scope = $scope
    @scope.hasItems = RegistryService.hasItems @scope.registries
    @scope.$watch 'registries', (registries) =>
      @scope.hasItems = RegistryService.hasItems registries

angular.module('octobluApp').controller 'RegistriesCollectionController', RegistriesCollectionController
