angular.module('octobluApp')
  .directive('flowEditorOmnibox', function () {
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
          console.log("selected", newFlowNodeType);
        });
      }
    };
  });
