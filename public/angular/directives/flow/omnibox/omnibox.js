angular.module('octobluApp')
  .directive('flowEditorOmnibox', function (FlowNodeTypeService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/pages/flow-editor-omnibox.html',
      scope : {
        flowNodeTypes : '=',
        flow : '='
      },
      link: function (scope, element) {

        scope.$watch(function(){
          scope.omniList = _.union([], scope.flowNodeTypes);
          if(scope.flow) {
            scope.omniList = _.union(scope.omniList, scope.flow.nodes);
          }
        });

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
