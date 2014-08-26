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
        var tabs = {
          nodes: {
            name: 'nodes',
            template: '/angular/directives/flow/flow-browser/flow-browser-nodes.html'
          }
        };

        $scope.activeTab = tabs.node;

        $scope.setActiveTab = function(tabName) {
          $scope.maximized = true;
          $scope.activeTab = tabs[tabName];
        };

        $scope.addFlowNodeType = function(flowNodeType) {
            var newFlowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
            $scope.flow.addNode(newFlowNode);
        };
      }
  };
  });
