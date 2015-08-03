angular
  .module('octobluApp')
  .directive 'flowDetailEditor',  ($window) ->
    {
      restrict: 'E',
      templateUrl: '/angular/directives/flow-detail-editor/flow-detail-editor.html',
      replace: true,
      controller: 'FlowDetailEditorController',
      controllerAs: 'controller'
      scope:
        flow: '='
    }
