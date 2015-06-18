angular.module('octobluApp')
.directive('compose', function () {
  return {
    restrict: 'E',
    controller: 'ComposeController',
    templateUrl: '/pages/compose.html',
    replace: true,
    scope: {
      data: '=',
      composeValues: '=',
      composeKeys: '='
    }
  };
});
