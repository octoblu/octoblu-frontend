angular.module('octobluApp')
.directive 'generateDeviceInstaller',  () ->
  {
    restrict: 'E'
    controller: 'GenerateDeviceInstallerController'
    controllerAs: 'controller'
    templateUrl: '/angular/directives/generate-device-installer/generate-device-installer.html'
    replace: false
    scope : {
      device: '='
      classes: '='
    }
  }
