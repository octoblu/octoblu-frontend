angular.module('octobluApp')
.directive 'pluginPlatformDependencies', ->
  restrict: 'E'
  templateUrl: '/angular/directives/plugin-platform-dependencies/plugin-platform-dependencies.html'
  replace: true
  controller: 'PluginPlatformDependencies'
  controllerAs: 'controller'
  scope:
    connector: '='
    platform: '='
