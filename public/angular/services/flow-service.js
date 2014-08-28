angular.module('octobluApp')
.service('FlowService', function ($http, $q, FlowModel, FlowNodeTypeService) {
  'use strict';
  var self, activeFlow;
  self = this;

  self.saveActiveFlow = function () {
    if(!activeFlow){return;}
    return $http.put("/api/flows/" + activeFlow.flowId, activeFlow);
  };
  self.debouncedSaveFlow = _.debounce(self.saveActiveFlow, 1000);

  self.selectNode = function(flowNode){
    activeFlow.selectedNode = flowNode;
  };

  self.addNodeFromFlowNodeType = function(flowNodeType){
    var newFlowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    activeFlow.nodes.push(newFlowNode);
    activeFlow.selectedNode = newFlowNode;
  };

  self.setActiveFlow = function(flow){
    activeFlow = flow;
  };

  self.start = function(){
    if(!activeFlow){return;}
    return $http.post("/api/flows/" + activeFlow.flowId + '/instance');
  };

  self.stop = function(){
    if(!activeFlow){return;}
    return $http.delete("/api/flows/" + activeFlow.flowId + '/instance');
  };

  self.restart = function(){
    if(!activeFlow){return;}
    return $http.put("/api/flows/" + activeFlow.flowId + '/instance');
  };

  self.getAllFlows = function () {
    return $http.get("/api/flows").then(function(response){
      if (_.isEmpty(response.data)) {
        return [self.newFlow({name: 'Flow 1'})];
      }

      return _.map(response.data, function(data) {
        return new FlowModel(data);
      });
    });
  };

  self.getSessionFlow = function () {
    return $http({method: 'GET', url: '/api/get/flow'})
    .then(function (response) {
      return response.data.flow;
    });
  };

  self.newFlow = function(options) {
    return FlowModel(options);
  };

  self.deleteFlow = function(flowId){
    return $http.delete('/api/flows/' + flowId).then(function(response){
      return response.data;
    });
  }
});
