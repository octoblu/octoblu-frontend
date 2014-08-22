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

        scope.$watch('selectedFlowNodeType', function(newFlowNodeType, oldFlowNodeType){
          if (_.isObject(newFlowNodeType)) {
            var newFlowNode = FlowNodeTypeService.createFlowNode(newFlowNodeType);
            scope.flow.addNode(newFlowNode);
          }
        });

      }
    };
  });
