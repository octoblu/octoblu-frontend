angular.module('octobluApp')
.service('FlowService', function (OCTOBLU_API_URL, $http, $q, AuthService, FlowModel, FlowNodeTypeService, NotifyService, deviceService) {
  'use strict';
  var self, activeFlow = {};
  self = this;
  var previousHashableFlow;

  self.hashFlow = function(flow) {
    var hashableFlow = _.pick(flow, ['links', 'nodes', 'name', 'description']);
    return XXH( JSON.stringify(hashableFlow), 0xABCD ).toString(16);
  };

  self.saveActiveFlow = function () {
    if(!activeFlow){return;}
    return self.saveFlow(activeFlow);
  };

  self.saveFlow = function(flow) {
    flow.hash = self.hashFlow(flow);
    return $http.put(OCTOBLU_API_URL + "/api/flows/" + flow.flowId, _.clone(flow)).then(function(response){
      self.notifyFlowSaved();
      return response;
    });
  };

  self.immediateNotifyFlowSaved = function(){
    NotifyService.notify("Flow Saved");
  };
  
  self.notifyFlowSaved = _.debounce(self.immediateNotifyFlowSaved, 3000);

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

  self.getActiveFlow = function(){
    return activeFlow;
  };

  self.start = function(flow){
    if(!flow && !activeFlow) return;
    if(!flow){
      flow = activeFlow;
    }

    $http.post(OCTOBLU_API_URL + "/api/flows/" + flow.flowId + '/instance');
  };

  self.stop = function(flow){
    if(!flow && !activeFlow) return;
    if(!flow){
      flow = activeFlow;
    }
    return $http.delete(OCTOBLU_API_URL + "/api/flows/" + flow.flowId + '/instance');
  };

  self.restart = function(flow){
    if(!flow && !activeFlow) return;
    if(!flow){
      flow = activeFlow;
    }
    return $http.put(OCTOBLU_API_URL + '/api/flows/' + flow.flowId + '/instance');
  };

  self.processFlows = function(flows){
    return FlowNodeTypeService.getFlowNodeTypes().then(function(flowNodeTypes){
      _.each(flows, function(flow){
        _.each(flow.nodes, function(node){
          if(node.type === 'operation:device'){
            return;
          }
          node.needsConfiguration = !_.findWhere(flowNodeTypes, {uuid: node.uuid});
          node.needsSetup         = !_.findWhere(flowNodeTypes, {type: node.type});

          if(node.needsConfiguration && !node.needsSetup){
            var matchingNode = _.findWhere(flowNodeTypes, {type: node.type});

            node.channelActivationId = matchingNode.defaults.channelActivationId;
            node.uuid                = matchingNode.defaults.uuid;
            node.token               = matchingNode.defaults.token;
            node.needsConfiguration  = false;
          }
        });
      });
      return flows;
    });
  };

  self.getAllFlows = function () {
    return $http.get(OCTOBLU_API_URL + '/api/flows').then(function(response){
      var flowData = _.reject(response.data, function(flow){
        return !flow.flowId;
      });

      if (_.isEmpty(flowData)) {
        return self.createFlow().then(function(flow){
          return self.processFlows([flow]);
        });
      }

      return self.processFlows(flowData).then(function(flows) {
        return _.map(flows, function(flow) {
          return new FlowModel(flow);
        });
      });
    });
  };

  self.getFlow = function(flowId) {
    return self.getAllFlows().then(function(flows){
      return _.findWhere(flows, {flowId : flowId});
    });
  };

  self.createFlow = function(flowAttributes) {
    return $http.post(OCTOBLU_API_URL + '/api/flows', flowAttributes).then(function(response) {
      var flow = response.data;
      if(!flow || !flow.flowId){
        return $q.reject(new Error('flow not created'));
      }
      return new FlowModel(flow);
    });
  };

  self.createDemoFlow = function(options) {
    return $http.post(OCTOBLU_API_URL + '/api/demo_flows').then(function(response) {
      return new FlowModel(response.data);
    });
  };

  self.deleteFlow = function(flowId){
    return $http.delete(OCTOBLU_API_URL + '/api/flows/' + flowId).then(function(response){
      return response.data;
    });
  };
});
