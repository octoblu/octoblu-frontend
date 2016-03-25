angular.module('octobluApp')
.directive 'flowTags',  () ->
  {
    restrict: 'E'
    templateUrl: '/angular/directives/flow-tags/flow-tags.html'
    controller: 'FlowTagsController'
    controllerAs: 'controller'
  }
