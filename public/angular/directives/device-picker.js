angular.module('octobluApp')
.directive('devicePicker', function () {
  return {
    restrict: 'E',
    controller: 'DevicePickerController',
    templateUrl: '/pages/device-picker.html',
    replace: true,
    scope: {
      model:   '=',
      devices: '='
    }
  };
});
