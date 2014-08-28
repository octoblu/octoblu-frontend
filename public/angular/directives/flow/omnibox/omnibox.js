angular.module('octobluApp')
  .directive('flowEditorOmnibox', function (FlowNodeTypeService) {
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
      link: function (scope, element) {
        scope.$watch('omniSearch', function(newItem){
          if(!_.isObject(newItem)) { return; }
          scope.selectItem(newItem);
        });
      }
    };
  });
