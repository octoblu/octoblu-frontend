angular.module('octobluApp')
.directive('paramInput', function () {

  return {
    restrict: 'E',
    controller: 'ParamInputController',
    scope: {
      ngModel: '=',
      paramDefinitions: '='
    },
    templateUrl: '/pages/param-input.html',
    replace: true
  };
});
