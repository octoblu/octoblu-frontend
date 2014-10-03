angular.module('octobluApp')
.directive('endpointSelector', function () {

  return {
    restrict: 'E',
    controller: 'FlowChannelFormController',
    scope: {
      node: '=ngModel'
    },
    templateUrl: '/pages/endpoint_selector.html',
    replace: true
  };
});
