angular.module('octobluApp')
.service('FlowService', function ($http, $q, FlowModel, FlowNodeTypeService, skynetService, AuthService) {
  'use strict';
  var self, activeFlow;
  self = this;

  self.saveActiveFlow = function () {
    if(!activeFlow){return;}
    var flow = _.clone(activeFlow);
    self.saveFlow(flow);
  };
  self.debouncedSaveFlow = _.debounce(self.saveActiveFlow, 1000);

  self.saveFlow = function(flow) {
    var hashableFlow = _.pick(flow, ['links', 'nodes']);
    flow.hash = XXH( JSON.stringify(hashableFlow), 0xABCD ).toString(16);
    return $http.put("/api/flows/" + flow.flowId, flow);
  }

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
    var currentUser;

    $http.post("/api/flows/" + activeFlow.flowId + '/instance');
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
        return self.createFlow().then(function(flow){
          return [flow];
        });
      }

      return _.map(response.data, function(data) {
        return new FlowModel(data);
      });
    });
  };

  self.createFlow = function(options) {
    return $http.post('/api/flows').then(function(response) {
      return new FlowModel(response.data);
    });
  }

  self.deleteFlow = function(flowId){
    return $http.delete('/api/flows/' + flowId).then(function(response){
      return response.data;
    });
  }
});
