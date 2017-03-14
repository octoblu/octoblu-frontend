angular.module('octobluApp')
.service('FlowService', function (OCTOBLU_API_URL, $http, $q, AuthService, FlowModel, FlowNodeTypeService, NotifyService, deviceService, ThingService, FlowLogService, HttpResponseHandler, UUIDService, MeshbluHttpService) {
  'use strict';
  var self, activeFlow = {};
  self = this;

  //Flow cruds

  self.sanitizeNodes = function(nodes) {
    return _.map(nodes, function(node) {
      return _.omit(node, [
        '$$hashKey',
        'defaults',
        'formTemplatePath',
        'helpText',
        'input',
        'output',
        'online',
        'errorMessage'
      ]);
    });
  }

  self.sanitizeFlow = function(flow) {
    return {
      flowId: flow.flowId,
      token: flow.token,
      name: flow.name,
      description: flow.description,
      links: flow.links,
      nodes: self.sanitizeNodes(flow.nodes),
      sessionId: flow.sessionId
    }
  }

  self.minimalNodes = function(nodes) {
    return _.map(nodes, function(node) {
      return _.omit(node,
        [
          '$$hashKey',
          'defaults',
          'formTemplatePath',
          'helpText',
          'logo',
          'input',
          'output',
          'online',
          'errorMessage',
          'needsConfiguration',
          'needsSetup',
          'channelActivationId',
          'uuid',
          'token',
          'omniboxItemTemplateUrl',
          'staticMessage'
        ]);
    }).filter(function(node) {
      return node.x !== undefined && node.y !== undefined;
    });
  }

  self.minimalFlow = function(flow) {
    var minFlow = {
      name: flow.name,
      description: flow.description,
      links: flow.links,
      nodes: self.minimalNodes(flow.nodes)
    }
    minFlow.minHash = self.hashFlow(minFlow);
    return minFlow;
  }

  self.createFlow = function(flowAttributes) {
    var deploymentUuid = UUIDService.v1();
    var logger = new FlowLogService(null, 'flow-create', deploymentUuid);
    var url = OCTOBLU_API_URL + '/api/flows';

    logger.logBegin();
    var request = $http({
      url: url,
      method: 'POST',
      headers: {
        deploymentUuid: deploymentUuid
      },
      data: flowAttributes
    });

    return handleResponseAndLog(request, logger)
      .then(function(data){
        self.notifyFlowSaved();
        return new FlowModel(data);
      });
  };

  self.saveFlow = function(flow) {
    var deploymentUuid = UUIDService.v1();
    flow = flow || activeFlow;
    if(!flow) return;
    flow = self.sanitizeFlow(flow);

    var url = OCTOBLU_API_URL + "/api/flows/" + flow.flowId;

    var request = $http({
      url: url,
      method: 'PUT',
      headers: {
        deploymentUuid: deploymentUuid
      },
      data: flow
    });
    return HttpResponseHandler.handle(request);
  };

  self.saveActiveFlow = function () {
    return self.saveFlow();
  };

  self.deleteFlow = function(flowId){
    if (!flowId) return;

    var deploymentUuid = UUIDService.v1();
    var logger = new FlowLogService(flowId, 'flow-delete', deploymentUuid);
    var url = OCTOBLU_API_URL + '/api/flows/' + flowId;

    logger.logBegin();
    var request = $http({
      url: url,
      method: 'DELETE',
      headers: {
        deploymentUuid: deploymentUuid
      }
    });

    return handleResponseAndLog(request, logger);
  };

  self.start = function(flow) {
    flow = flow || activeFlow;
    if(!flow) return;

    var deploymentUuid = UUIDService.v1()
    var url = OCTOBLU_API_URL + "/api/flows/" + flow.flowId + '/instance';
    var logger = new FlowLogService(flow.flowId, 'flow-start', deploymentUuid);

    logger.logBegin();

    var request = $http({
      url: url,
      method: 'POST',
      headers: {
        deploymentUuid: deploymentUuid
      }
    });

    return handleResponseAndLog(request, logger);
  };

  self.stop = function(flow) {
    flow = flow || activeFlow;
    if(!flow) return;

    var deploymentUuid = UUIDService.v1();
    var url = OCTOBLU_API_URL + "/api/flows/" + flow.flowId + '/instance';
    var logger = new FlowLogService(flow.flowId, 'flow-stop', deploymentUuid);

    logger.logBegin();

    var request = $http({
      url: url,
      method: 'DELETE',
      headers: {
        deploymentUuid: deploymentUuid
      },
      data: flow
    });

    return handleResponseAndLog(request, logger);
  };

  function handleResponseAndLog(request, logger) {
    return HttpResponseHandler.handle(request)
      .then(function(data){
        logger.logEnd();
        return data;
      })
      .catch(function(error){
        logger.logError(error.message);
        throw new Error(error.message);
      });
  }

  self.hashFlow = function(flow) {
    var hashableFlow = _.pick(flow, ['links', 'nodes', 'name', 'description']);
    return XXH.h32( JSON.stringify(hashableFlow), 0xABCD ).toString(16);
  };

  self.needsPermissions = function(receiverUuid, uuids) {
    var projection = {
      uuid: true,
      receiveAsWhitelist: true,
      sendWhitelist: true
    };
    return ThingService.getThings(null, projection)
      .then(function(things){
        var thingsToCheck = _.filter(things, function(thing){
          return _.includes(uuids, thing.uuid);
        });

        return _.reject(thingsToCheck, function(thing){
          var receiveAsOk = false;
          var sendOk = false;
          if( _.includes(thing.receiveAsWhitelist, '*') ) {
            receiveAsOk = true;
          }
          if ( _.includes(thing.receiveAsWhitelist, receiverUuid) ) {
            receiveAsOk = true;
          }
          if( _.includes(thing.sendWhitelist, '*') ) {
            sendOk = true;
          }
          if ( _.includes(thing.sendWhitelist, receiverUuid) ) {
            sendOk = true;
          }

          return receiveAsOk && sendOk;
        });

      });
  };

  self.subscribeFlowToDevices = function(flowUuid, deviceUuids){
    async.each(deviceUuids, function(deviceUuid, callback){
      MeshbluHttpService.createSubscription({
        subscriberUuid: flowUuid,
        emitterUuid:    deviceUuid,
        type:         'broadcast.sent'
      }, callback);
    }, function(error){
      if(error){
        console.error(error);
      }
    });
  }

  self.immediateNotifyFlowSaved = function(){
    NotifyService.notify("Flow Saved");
  };

  self.notifyFlowSaved = _.debounce(self.immediateNotifyFlowSaved, 3000);

  self.selectNode = function(flowNode){
    if (activeFlow.selectedFlowNode === flowNode) {
      return;
    }
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

  self.getAllFlows = function () {
    return $http.get(OCTOBLU_API_URL + '/api/v2/flows').then(function(response){
      var flowData = _.reject(response.data, function(flow){
        return !flow.flowId;
      });

      if (_.isEmpty(flowData)) {
        return self.createFlow().then(function(flow){
          return [flow];
        });
      }

      return flowData
    });
  };

  self.getSomeFlows = function (limit) {
    return $http.get(OCTOBLU_API_URL + '/api/v2/flows/' + limit + '/paged').then(function(response){
      var flowData = _.reject(response.data, function(flow){
        return !flow.flowId;
      });

      if (_.isEmpty(flowData)) {
        return self.createFlow().then(function(flow){
          return [flow];
        });
      }

      return flowData
    });
  };

  self.getFlow = function(flowId) {
    return $http.get(OCTOBLU_API_URL + '/api/flows/' + flowId).then(function(response){
      return new FlowModel(response.data);
    });
  };

  self.createDemoFlow = function(options) {
    return $http.post(OCTOBLU_API_URL + '/api/demo_flows').then(function(response) {
      return new FlowModel(response.data);
    });
  };

  return self;
});
