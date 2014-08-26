angular.module('octobluApp')
  .directive('flowBrowser', function () {

    return {
      restrict: 'E',
      templateUrl: '/angular/directives/flow/flow-browser/flow-browser.html',
      replace: true,
      scope: {
        flowNodeTypes : '=',
        flow: '='
      },

      controller: function ($scope, FlowNodeTypeService) {
        
        $scope.addFlowNodeType = function(flowNodeType) {
            var newFlowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
            $scope.flow.addNode(newFlowNode);
        };
      }
  };
  });
