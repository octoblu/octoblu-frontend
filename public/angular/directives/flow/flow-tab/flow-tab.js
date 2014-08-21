angular.module('octobluApp')
  .directive('flowTab', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/angular/directives/flow/flow-tab/flow-tab.html',
      link: function (scope, element) {
        scope.$watch('editName', function (editName) {
          if (editName) {
            element.find('input').focus();
          }
        });
      }
    }
  });