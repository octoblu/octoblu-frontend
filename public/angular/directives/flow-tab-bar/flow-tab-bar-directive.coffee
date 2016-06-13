angular.module('octobluApp')
.directive 'flowTabBar',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/flow-tab-bar/flow-tab-bar.html'
    controller: 'FlowTabBarController'
    controllerAs: 'controller'
    replace: true
    transclude: true
    scope:
      filterModel: "="
  }
