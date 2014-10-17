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
      debugLines: '=',
      activeFlow: '='
    },
<<<<<<< HEAD
    controller: function ($scope, FlowNodeTypeService, reservedProperties) {
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
        },
        shareflow: {
          name: 'shareflow',
          template: '/pages/flow-browser-shareflow.html',
          controlsTemplate: '/pages/flow-browser-shareflow-controls.html'
        }
      };

      $scope.flowBrowser = {};
      $scope.flowBrowser.activeFlowJson = '';

      $scope.activeFlowEdit = false;

      $scope.toggleActiveTab = function(name) {
        if ($scope.maximized && $scope.activeTab.name === name) {
          $scope.minimize();
        } else {
          $scope.maximize();
          $scope.setActiveTab(name);
        }
      };

      $scope.addFlowNodeType = function(flowNodeType) {
        $scope.$emit('flow-node-type-selected', flowNodeType);
      };

      $scope.maximize = function() {
        $scope.maximized = true;
      };

      $scope.minimize = function() {
        $scope.maximized = false;
      };

      $scope.clearActiveTab = function() {
        $scope.activeTab = {};
      };

      $scope.setActiveTab = function(name) {
        $scope.activeTab = tabs[name];
      };

      $scope.hasActiveTab = function() {
        return !_.isEmpty($scope.activeTab);
      };

      $scope.toggleMaximize = function() {
        $scope.maximized = !$scope.maximized;
      };

      $scope.toggleDrawer = function(){
        $scope.toggleMaximize();
        if (!$scope.hasActiveTab()) {
          $scope.setActiveTab('debug');
        }
      };

      $scope.$watch('maximized', function(){
        _.delay(function(){
          $('.flow-browser').trigger($.Event('resize'));
        }, 300);
      });


      $scope.setActiveEdit = function(){
        $scope.activeFlowEdit = !$scope.activeFlowEdit;
      };

      $scope.handleActiveFlowChange = function(json){
        $scope.shareFlowError = false;
        $scope.shareFlowSuccess = false;
        var flow;
        // Does it validate JSON?
        try{
          flow = JSON.parse(json);
        }catch(e){
          // Negatory Captin
          $scope.shareFlowError = true;
          return;
        }
        // Is it an object?
        if(!_.isObject(flow)){
          // You should know better than to fool a fool
          $scope.shareFlowError = true;
          return;
        }
        $scope.shareFlowSuccess = true;
        $scope.$emit('update-active-flow-edit', flow);
      };

      $scope.$watch('activeFlow', function(newFlow, oldFlow){
         if(newFlow){
           $scope.flowBrowser.activeFlowJson = angular.toJson(newFlow, true);
         }
      }, true);

      $scope.filterNonOperators = function(flowNodeType){
        return flowNodeType && (flowNodeType.category === 'device' || flowNodeType.category === 'channel');
      };

      $scope.filterOperators = function(flowNodeType){
        return flowNodeType && (flowNodeType.category !== 'device' && flowNodeType.category !== 'channel');
      };

      $scope.clearActiveTab();
=======
    controller: 'FlowBrowserController',
    link: function(scope,element) {
      scope.selectAll = function() {
        $('textarea').select();
      };
>>>>>>> FETCH_HEAD
    }
  };
});
