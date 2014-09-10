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
    replace: true,
    link: function(scope, element, attr, ngModel){
      function fromUser(text) {
          return (text || '').toUpperCase();
      }

      function toUser(text) {
          return (text || '').toLowerCase();
      }
      ngModel.$parsers.push(fromUser);
      ngModel.$formatters.push(toUser);
    }
  };
});
