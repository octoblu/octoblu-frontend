angular.module('octobluApp')
  .directive('flowBrowser', function () {

    return {
      restrict: 'E',
      templateUrl: '/pages/flow-browser.html',
      replace: true,
      scope: {
        flowNodeTypes : '=',
        flow: '=',
        debugLines: '='
      },
      controller: function ($scope, FlowNodeTypeService) {
        var tabs = {
          debug: {
            name: 'debug',
            template: '/pages/flow-browser-debug.html',
            controlsTemplate: '/pages/flow-browser-debug-controls.html'
          },
          nodes: {
            name: 'nodes',
            template: '/pages/flow-browser-nodes.html',
            controlsTemplate: '/pages/flow-browser-nodes-controls.html'
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

        $scope.toggleDrawer = function(){
          $scope.maximized = !$scope.maximized;
          if(!$scope.maximized) {
            $scope.activeTab = null;
          }
        };
      }
  };
  });
