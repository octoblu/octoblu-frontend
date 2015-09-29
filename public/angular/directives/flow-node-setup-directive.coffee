angular.module('octobluApp')
.directive 'flowNodeSetup',  ($window) ->
  {
    restrict: 'E'
    templateUrl: '/pages/flow-node-setup.html'
    controller: 'FlowNodeSetupController'
    controllerAs: 'controller'
    replace: true
    scope:
      nodeType: '='
      logo: '='
  }
