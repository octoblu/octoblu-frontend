angular.module('octobluApp')
.service('FlowService', function (OCTOBLU_API_URL, $http, $q, AuthService, FlowModel, FlowNodeTypeService, NotifyService, deviceService, ThingService, FlowLogService) {
  'use strict';
  var self, activeFlow = {};
  self = this;
  var previousHashableFlow;

  //Flow crud
  self.createFlow = function(flowAttributes) {
    var workflow = 'flow-create';
    var url = OCTOBLU_API_URL + '/api/flows';

    FlowLogService.logStart(null, workflow);

    return handleHttpResponse($http.post(url, flowAttributes), workflow)
      .then(function(data){
        self.notifyFlowSaved();
        return new FlowModel(data);
      });
  };

  self.saveFlow = function(flow) {
    flow = flow || activeFlow;
    if(!flow) return;

    var workflow = 'flow-save';
    var url = OCTOBLU_API_URL + "/api/flows/" + flow.flowId;

    FlowLogService.logStart(flow.flowId, workflow);
    flow.hash = self.hashFlow(flow);

    return handleHttpResponse($http.put(url, flow), workflow, flow.flowId)
      .then(function(data){
        self.notifyFlowSaved();
        return data;
      });
  };

  self.saveActiveFlow = function () {
    return self.saveFlow();
  };

  self.start = function(flow){
    flow = flow || activeFlow;
    if(!flow) return;

    var workflow = 'flow-start';
    var url = OCTOBLU_API_URL + "/api/flows/" + flow.flowId;

    FlowLogService.logStart(flow.flowId, workflow);

    return handleHttpResponse($http.put(url, flow), workflow, flow.flowId);
  };

  self.deleteFlow = function(flowId){
    if (!flowId) return;

    var workflow = 'flow-delete';
    var url = OCTOBLU_API_URL + '/api/flows/' + flowId;

    FlowLogService.logStart(flowId, workflow);

    return handleHttpResponse($http.delete(url), workflow, flowId);
  };

  //log errors, handle http request errors
  function handleHttpResponse(request, workflow, flowId) {
    return request
      .then(function(response){
        if(response.status >= 400) {
          return $q.reject(new Error("server returned a" + response.status));
        }

        FlowLogService.logEnd(workflow, flowId);
        return response.data;
      })
      .catch(function(error) {
          var message;
          if(error && error.message) {
            message = error.message;
          }

          FlowLogService.logError(workflow, flowId, message);
          return $q.reject(new Error(message));
      });
  };

  self.hashFlow = function(flow) {
    var hashableFlow = _.pick(flow, ['links', 'nodes', 'name', 'description']);
    return XXH( JSON.stringify(hashableFlow), 0xABCD ).toString(16);
  };

  self.needsPermissions = function(receiverUuid, uuids) {
    return ThingService.getThings()
      .then(function(things){
        var thingsToCheck = _.filter(things, function(thing){
          return _.contains(uuids, thing.uuid);
        });

        return _.reject(thingsToCheck, function(thing){
          var receiveAsOk = false;
          var sendOk = false;
          if( _.contains(thing.receiveAsWhitelist, '*') ) {
            receiveAsOk = true;
          }
          if ( _.contains(thing.receiveAsWhitelist, receiverUuid) ) {
            receiveAsOk = true;
          }
          if( _.contains(thing.sendWhitelist, '*') ) {
            sendOk = true;
          }
          if ( _.contains(thing.sendWhitelist, receiverUuid) ) {
            sendOk = true;
          }

          return receiveAsOk && sendOk;
        });

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

  self.createDemoFlow = function(options) {
    return $http.post(OCTOBLU_API_URL + '/api/demo_flows').then(function(response) {
      return new FlowModel(response.data);
    });
  };

});
