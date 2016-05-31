angular.module('octobluApp')
.directive 'deviceSchema',  ($window) ->
  {
    restrict: 'E'
    templateUrl: '/pages/device-schema-directive.html'
    controller: 'DeviceSchemaController'
    scope:
      device: '='
      model: '='
  }
