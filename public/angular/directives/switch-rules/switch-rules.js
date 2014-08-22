angular.module('octobluApp')
.directive('switchRules', function () {

  return {
    restrict: 'E',
    controller: 'switchRulesController',
    scope: {
      node: '=ngModel'
    },
    templateUrl: '/angular/directives/switch-rules/switch-rules.html',
    replace: true
  };
});
