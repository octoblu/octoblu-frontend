class PluginPlatformDependencies
  constructor: ($scope, ConnectorDetailService) ->
    @scope = $scope
    @ConnectorDetailService = ConnectorDetailService
    @connector = @scope.connector
    @platform = @scope.platform
    @scope.PLATFORMS =
      darwin: 'Mac OS X'
      win32: 'Windows'
      win64: 'Windows'
      linux: 'Linux'
      ios: 'iOS'
      android: 'Android'
    @scope.showAll = false
    @scope.friendlyPlatform = @scope.PLATFORMS[@platform]
    @ConnectorDetailService.getDependenciesForPackage @connector
      .then (result) =>
        @dependencies = result.data
        @setDependencies()

  setDependencies: =>
    @scope.allDependencies = {}
    @scope.platformDependencies = []
    @scope.platformDependencies = @dependencies[@platform] if @dependencies[@platform]?
    @scope.allDependencies = @dependencies
    @scope.showAll = !@dependencies[@platform]?

angular.module('octobluApp').controller 'PluginPlatformDependencies', PluginPlatformDependencies
