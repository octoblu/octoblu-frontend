{angular} = window

class RegistriesController
  constructor:  ($scope, NotifyService, RegistryService) ->
    @scope = $scope
    @NotifyService = NotifyService
    @RegistryService = RegistryService
    @registries = {}
    @loading = true
    @hasResults = false
    @RegistryService.getRegistries()
      .catch (error) =>
        @NotifyService.notifyError error
        @loading = false
      .then (@registries) =>
        @loading = false
        @scope.$watch 'registries', @setHasResults
        @scope.$watch 'filterByName', (filterByName='') =>
          filterByName = filterByName.toLowerCase()
          @registries = @RegistryService.filterBy 'name', filterByName

  setHasResults: =>
    @hasResults = @RegistryService.hasItems @registries

angular.module('octobluApp').controller 'RegistriesController', RegistriesController
