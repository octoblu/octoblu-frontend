angular.module('octobluApp')
.controller('FlowNodeEditorController', function ($scope, FlowService, FlowNodeTypeService) {
  'use strict';

  var setFlowNodeType = function() {
    if(!$scope.flowNode) {
      $scope.flowNodeType = null;
      return;
    }

    FlowNodeTypeService.getFlowNodeType($scope.flowNode.type).then(function(flowNodeType){
      $scope.flowNodeType = null;
      $scope.flowNodeType = flowNodeType;
    });

    FlowNodeTypeService.getOtherMatchingFlowNodeTypes($scope.flowNode.type).then(function(otherMatchingFlowNodeTypes){
      $scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes;
    });
  };

  $scope.close = function(){
    $scope.flowNode = null;
  };

  $scope.toggleHelp = function(){
    $scope.showHelp = !$scope.showHelp;
  };

  $scope.deleteNode = function(){
    var activeFlow = FlowService.getActiveFlow();

    if (!activeFlow) { return; }

    if(activeFlow.selectedFlowNode) {
      var nodeId = activeFlow.selectedFlowNode.id;
      var linksToRemove = _.union( _.filter(activeFlow.links, {to: nodeId}), _.filter(activeFlow.links, {from: nodeId}) );
      activeFlow.links = _.difference(activeFlow.links, linksToRemove);
    }

    _.pull(activeFlow.nodes, activeFlow.selectedFlowNode);
    _.pull(activeFlow.links, activeFlow.selectedLink);

    activeFlow.selectedFlowNode = null;
    activeFlow.selectedLink = null;

    FlowService.saveActiveFlow(activeFlow);
  };

  setFlowNodeType();
  $scope.$watch('flowNode', setFlowNodeType);
});
