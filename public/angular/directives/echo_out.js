angular.module('octobluApp')
.directive('echoOut', function () {
  return {
    restrict: 'E',
    controller: 'EchoOutController',
    templateUrl: '/pages/echo-out.html',
    replace: true,
    scope: {
      url: '=',
      text: '=',
      response: '=',
      enable: '='
    }
  };
});
