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
    @scope.platformDependencies = null if _.isNull @dependencies[@platform]
    {darwin, win32, win64, linux, ios, android} = @dependencies
    @scope.allDependencies = darwin: darwin, win32: win32, win64: win64, linux: linux, ios: linux, android: android
    @scope.allDependencieKeys = _.keys @scope.allDependencies
    @scope.showAll = !_.isNull(@scope.platformDependencies) && _.isEmpty(@scope.platformDependencies)

angular.module('octobluApp').controller 'PluginPlatformDependencies', PluginPlatformDependencies
