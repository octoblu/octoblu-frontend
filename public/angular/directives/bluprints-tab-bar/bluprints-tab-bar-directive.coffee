angular.module('octobluApp')
.directive 'bluprintsTabBar',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/bluprints-tab-bar/bluprints-tab-bar.html'
    replace: true
    transclude: true
    scope:
      selectedTab: "@"
      filterModel: "="
  }
