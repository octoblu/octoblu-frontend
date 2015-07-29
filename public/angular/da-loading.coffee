angular.module('octobluApp')
.directive 'daLoading',  ($window) ->
  {
    restrict: 'AE',
    templateUrl: '/pages/da-loading.html',
    replace: true,
    transclude: true,
    controller : 'DaLoadingController',
    controllerAs : 'controller',
    scope : {
      loading : '='
    }
  }
