angular.module('octobluApp')
.directive 'breadcrumbTabBar',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/breadcrumb-tab-bar/breadcrumb-tab-bar.html'
    replace: true
    transclude: true
    scope:
      parentTabLink: "@"
      parentTabLabel: "@"
      selectedTabName: "@"
  }
