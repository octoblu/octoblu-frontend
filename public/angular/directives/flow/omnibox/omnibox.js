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
        scope.filterResults = function(searchText){
          var filterRegex = new RegExp(searchText);
          return _.filter(scope.flowNodeTypes, function(flowNodeType){
            return filterRegex.test(flowNodeType.defaults.type) || filterRegex.test(flowNodeType.category) || filterRegex.test(flowNodeType.name);
          });
        };

        scope.$watch('selectedFlowNodeType', function(newFlowNodeType, oldFlowNodeType){
          if (_.isObject(newFlowNodeType)) {
            var newFlowNode = FlowNodeTypeService.createFlowNode(newFlowNodeType);
            scope.flow.addNode(newFlowNode);
          }
        });
      }
    };
  });
