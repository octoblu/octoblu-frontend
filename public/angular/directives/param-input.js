angular.module('octobluApp')
.directive('paramInput', function () {

  return {
    restrict: 'E',
    controller: 'ParamInputController',
    scope: {
      model: '=',
      paramStyle: '@',
      selectedEndpoint: '='
    },
    templateUrl: '/pages/param-input.html',
    replace: true
  };
});
