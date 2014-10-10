angular.module('octobluApp')
.directive('deviceMessageForm', function () {
  return {
    restrict: 'E',
    controller: 'DeviceMessageFormController',
    templateUrl: '/pages/device-message-form.html',
    replace: true,
    scope: {
      model: '=',
      uuid:  '=',
      token: '='
    }
  };
});
