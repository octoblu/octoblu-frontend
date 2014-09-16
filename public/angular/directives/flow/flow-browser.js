angular.module('octobluApp')
  .directive('flowBrowser', function () {

    return {
      restrict: 'E',
      templateUrl: '/pages/flow-browser.html',
      replace: true,
      scope: {
        flowNodeTypes : '=',
        nodeTypes : '=',
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
          operators : {
            name: 'operators',
            template: '/pages/flow-browser-operators.html',
            controlsTemplate: '/pages/flow-browser-operators-controls.html'
          },
          nodes: {
            name: 'nodes',
            template: '/pages/flow-browser-nodes.html',
            controlsTemplate: '/pages/flow-browser-nodes-controls.html'
          },
          unconfigurednodes: {
            name: 'unconfigurednodes',
            template: '/pages/flow-browser-unconfigured-nodes.html',
            controlsTemplate: '/pages/flow-browser-nodes-controls.html'
          }
        };

        $scope.activeTab = tabs.node;

        $scope.setActiveTab = function(tabName) {
          $scope.maximized = true;
          $scope.activeTab = tabs[tabName];
        };

        $scope.addFlowNodeType = function(flowNodeType) {
          $scope.$emit('flow-node-type-selected', flowNodeType);
        };

        $scope.toggleDrawer = function(){
          $scope.maximized = !$scope.maximized;
          if(!$scope.maximized) {
            $scope.activeTab = null;
          }
        };

        $scope.$watch('maximized', function(){
          _.delay(function(){
            $('.flow-browser').trigger($.Event('resize'));
          }, 300);
        });

        $scope.filterNonOperators = function(flowNodeType){
          return flowNodeType && (flowNodeType.category === 'device' || flowNodeType.category === 'channel');
        };

        $scope.filterOperators = function(flowNodeType){
          return flowNodeType && (flowNodeType.category !== 'device' && flowNodeType.category !== 'channel');
        };
      }
  };
  });
