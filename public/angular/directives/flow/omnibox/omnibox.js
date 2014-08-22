angular.module('octobluApp')
  .directive('flowEditorOmnibox', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/pages/flow-editor-omnibox.html',
    };

  });