class PluginPlatformDependencies
  constructor: ($scope, NPMRegistryService) ->
    @scope = $scope
    @scope.dependencies = []
    @NPMRegistryService = NPMRegistryService

    @NPMRegistryService.getDependenciesForPackage 'meshblu-ble-heartrate'

    # Service get us the package.json for this package
    # and return the dependencies

angular.module('octobluApp').controller 'PluginPlatformDependencies', PluginPlatformDependencies
