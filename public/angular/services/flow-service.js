angular.module('octobluApp')
.service('FlowService', function ($http, $q, FlowModel, FlowNodeTypeService) {
  'use strict';
  var self, activeFlow;
  self = this;

  self.saveActiveFlow = function () {
    if(!activeFlow){return;}
    var flow = _.clone(activeFlow);
    flow.hash = dcodeIO.bcrypt.hashSync(JSON.stringify(flow));
    return $http.put("/api/flows/" + flow.flowId, flow);
  };
  self.debouncedSaveFlow = _.debounce(self.saveActiveFlow, 1000);

  self.selectNode = function(flowNode){
    activeFlow.selectedFlowNode = flowNode;
  };

  self.addNodeFromFlowNodeType = function(flowNodeType){
    var newFlowNode = FlowNodeTypeService.createFlowNode(flowNodeType);
    activeFlow.nodes.push(newFlowNode);
    activeFlow.selectedFlowNode = newFlowNode;
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

  self.newFlow = function(options) {
    return FlowModel(options);
  };

  self.deleteFlow = function(flowId){
    return $http.delete('/api/flows/' + flowId).then(function(response){
      return response.data;
    });
  }
});
