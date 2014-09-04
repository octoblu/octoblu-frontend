angular.module('octobluApp')
  .directive('flowEditorOmnibox', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/pages/flow-editor-omnibox.html',
      controller: 'OmniboxController',
      scope : {
        flowNodes : '=',
        selectedFlowNode: '=',
        omniSearch: '='
      },
      link: function (scope) {
        scope.$watch('omniSearch', function(newItem){
          if(!_.isObject(newItem)) { return; }
          scope.selectItem(newItem);
        });
      }
    };
  });
