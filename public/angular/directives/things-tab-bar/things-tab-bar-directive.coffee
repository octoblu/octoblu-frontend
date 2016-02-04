angular.module('octobluApp')
.directive 'thingsTabBar',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/things-tab-bar/things-tab-bar.html'
    replace: true
    transclude: true
    scope:
      selectedTab: "@"
      filterModel: "="

  }
