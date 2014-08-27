angular.module('octobluApp')
  .directive('flowEditorOmnibox', function (FlowNodeTypeService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/pages/flow-editor-omnibox.html',
      controller: 'OmniboxController',
      scope : {
        flow : '='
      },
      link: function (scope, element) {

        scope.$watch('omniSearch', function(newItem){
          if (!_.isObject(newItem)){ return; }

          if(newItem.id){
            scope.flow.selectedFlowNode = newItem;
          } else {
            var newFlowNode = FlowNodeTypeService.createFlowNode(newItem);
            scope.flow.addNode(newFlowNode);
          }
        });

      }
    };
  });
