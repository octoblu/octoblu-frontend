angular.module('octobluApp')
.directive('flowNodeSetup', function ($window) {
  return {
    restrict: 'E',
    templateUrl: '/pages/flow-node-setup.html',
    controller: 'FlowNodeSetupController',
    scope: {
      nodeType: '='
    },
  };
});
