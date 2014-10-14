angular.module('octobluApp')
.service('FlowService', function ($http, $q, FlowModel, FlowNodeTypeService, skynetService, AuthService) {
  'use strict';
  var self, activeFlow;
  self = this;
  var previousHashableFlow;

  self.hashFlow = function(flow) {
    var hashableFlow = _.pick(flow, ['links', 'nodes', 'name']);
    return XXH( JSON.stringify(hashableFlow), 0xABCD ).toString(16);
  };

  self.saveActiveFlow = function () {
    if(!activeFlow){return;}
    self.saveFlow(activeFlow);
  };

  self.saveFlow = function(flow) {
    flow.hash = self.hashFlow(flow);
    return $http.put("/api/flows/" + flow.flowId, _.clone(flow));
  };

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
        return self.createDemoFlow().then(function(flow){
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
  };

  self.createDemoFlow = function(options) {
    return $http.post('/api/demo_flows').then(function(response) {
      return new FlowModel(response.data);
    });
  };

  self.deleteFlow = function(flowId){
    return $http.delete('/api/flows/' + flowId).then(function(response){
      return response.data;
    });
  };
});
