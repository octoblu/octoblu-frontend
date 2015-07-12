angular.module('octobluApp')
.directive 'flowDeployButton', ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/flow-deploy-button/flow-deploy-button.html'
    replace: true
    controller: 'FlowDeployButtonController'
    controllerAs: 'controller'
    scope: {
      device: '='
      flow: '='
    }
  }
