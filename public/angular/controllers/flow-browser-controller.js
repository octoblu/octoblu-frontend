'use strict';

angular.module('octobluApp')
  .controller('FlowBrowserController', function ($scope, $mdDialog, FlowNodeTypeService, reservedProperties) {
    var tabs = {
      debug: {
        name: 'debug',
        template: '/pages/flow-browser-debug.html',
        controlsTemplate: '/pages/flow-browser-debug-controls.html'
      },
      flows : {
        name: 'flows',
        template: '/pages/flow-browser-flows.html',
        viewStyle: 'thumbnail',
        controlsTemplate: '',
        detailTemplate: '',
        thumbnailTemplate: '/pages/flow-flows-thumbnail-list.html'
      },
      operators : {
        name: 'operators',
        template: '/pages/flow-browser-operators.html',
        viewStyle: 'thumbnail',
        controlsTemplate: '/pages/flow-browser-view-controls.html',
        detailTemplate: '/pages/flow-operators-detail-list.html',
        thumbnailTemplate: '/pages/flow-operators-thumbnail-list.html'
      },
      nodes: {
        name: 'nodes',
        template: '/pages/flow-browser-nodes.html',
        viewStyle: 'thumbnail',
        controlsTemplate: '/pages/flow-browser-view-controls.html',
        detailTemplate: '/pages/flow-nodes-detail-list.html',
        thumbnailTemplate: '/pages/flow-nodes-thumbnail-list.html'
      },
      unconfigurednodes: {
        name: 'unconfigurednodes',
        template: '/pages/flow-browser-unconfigured-nodes.html',
        viewStyle: 'thumbnail',
        controlsTemplate: '/pages/flow-browser-view-controls.html',
        detailTemplate: '/pages/flow-unconfigured-nodes-detail-list.html',
        thumbnailTemplate: '/pages/flow-unconfigured-nodes-thumbnail-list.html'
      },
      shareflow: {
        name: 'shareflow',
        template: '/pages/flow-browser-shareflow.html',
        controlsTemplate: '/pages/flow-browser-shareflow-controls.html'
      }
    };

    $scope.flowBrowser = {};
    $scope.flowBrowser.activeFlowJson = '';
    $scope.template = {};

    $scope.activeFlowEdit = false;

    $scope.toggleActiveTab = function(name) {
      if ($scope.activeFlow.browserMaximized && $scope.activeFlow.browserTab.name === name) {
        $scope.minimize();
      } else {
        $scope.maximize();
        $scope.setActiveTab(name);
      }
    };

    $scope.toggleViewSource = function() {
      $scope.viewSource = !$scope.viewSource;
    }

    $scope.addFlowNodeType = function(flowNodeType) {
      $scope.$emit('flow-node-type-selected', flowNodeType);
    };

    $scope.maximize = function() {
      $scope.activeFlow.browserMaximized = true;
    };

    $scope.minimize = function() {
      $scope.activeFlow.browserMaximized = false;
    };

    $scope.clearActiveTab = function() {
      if(!$scope.activeFlow) {
        return;
      }

      $scope.activeFlow.browserTab = {};
    };

    $scope.setActiveTab = function(name) {
      $scope.activeFlow.browserTab = tabs[name];
    };

    $scope.hasActiveTab = function() {
      return !_.isEmpty($scope.activeFlow.browserTab);
    };

    $scope.toggleMaximize = function() {
      $scope.activeFlow.browserMaximized = !$scope.activeFlow.browserMaximized;
    };

    $scope.toggleDrawer = function(){
      $scope.toggleMaximize();
      if (!$scope.hasActiveTab()) {
        $scope.setActiveTab('debug');
      }
    };

    $scope.switchViewStyle = function(viewStyle) {
      $scope.activeFlow.browserTab.viewStyle = viewStyle;
    };

    $scope.templateForViewStyle = function() {
      if ($scope.activeFlow.browserTab.viewStyle === 'detail')
        return $scope.activeFlow.browserTab.detailTemplate;

      if ($scope.activeFlow.browserTab.viewStyle === 'thumbnail')
        return $scope.activeFlow.browserTab.thumbnailTemplate;

      return null;
    }

    $scope.setActiveEdit = function(){
      $scope.activeFlowEdit = !$scope.activeFlowEdit;
    };

    $scope.clearFlow = function() {
      $scope.flowBrowser.activeFlowJson = '';
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
  });
