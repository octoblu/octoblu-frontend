angular.module('octobluApp')
  .directive 'flowDevice', ->
    restrict: 'E'
    controller: 'FlowDeviceController'
    templateUrl: '/angular/directives/flow-device/flow-device.html'
    replace: true
    scope:
      flowNode: '='
