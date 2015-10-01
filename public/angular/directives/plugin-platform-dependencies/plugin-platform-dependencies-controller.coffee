class PluginPlatformDependencies
  constructor: ($scope, ConnectorDetailService) ->
    @scope = $scope
    @scope.dependencies = {}
    @ConnectorDetailService = ConnectorDetailService

    @ConnectorDetailService.getDependenciesForPackage @scope.connector
      .then (dependencies) =>
        console.log 'got dependencies'
        @scope.dependencies = dependencies

angular.module('octobluApp').controller 'PluginPlatformDependencies', PluginPlatformDependencies
