angular.module('octobluApp')
.service('FlowNodeTypeService', function (OCTOBLU_API_URL, $http, $q, UUIDService, NodeService, DeviceLogo, ThingService, NodeTypeService) {
  'use strict';

  var self = this;

  self.createFlowNode = function(flowNodeType){
    var defaults = _.cloneDeep(flowNodeType.defaults);

    return _.defaults({id: UUIDService.v4(), resourceType: 'flow-node'}, defaults, flowNodeType);
  };

  self.getFlowNodeType  = function(type){
    return self.getFlowNodeTypes().then(function(flowNodeTypes){
      return _.findWhere(flowNodeTypes, {type: type});
    });
  };

  self.getFlowNodeTypeByUUID = function(uuid){
    return self.getFlowNodeTypes().then(function(flowNodeTypes){
      return _.findWhere(flowNodeTypes, {uuid: uuid});
    });
  };

  self.convertNode = function(node){
    if (node.type == 'octoblu:flow') {
      node = _.extend(node, {
        type: 'device:flow',
        staticMessage: {},
        topic: 'flow',
        filterTopic: 'message',
        useStaticMessage: true
      });
    }
    return _.extend(node, {
      category: 'device',
      name: node.name,
      class: _.kebabCase(node.type),
      type: node.type,
      category: node.category,
      uuid: node.uuid,
      defaults: node,
      input: 1,
      output: 1,
      formTemplatePath: "/pages/node_forms/" + node.category + "_form.html"
    });
  };

  self.getFlowNodeTypes = function() {
    return $q.all([NodeTypeService.getNodeTypes(), self.getDevices(), self.getNodeTypes()]).then(function(results) {
      var nodeTypes = results[0];
      var nodes = _.union(results[1], results[2]);
      return _.map(nodes, function(node){
        node.defaults = node.defaults || {};
        node.defaults.nodeType = _.findWhere(nodeTypes, {type: node.type});
        return node;
      });
    });
  }

  self.getDevices = function() {
    var projection = {
      uuid: true,
      name: true,
      type: true,
      logo: true,
      category: true
    }
    return ThingService.getThings({type: {$ne: 'octoblu:user'}}, projection).then(function(devices){
      devices = _.map(devices, self.convertNode);
      devices = _.map(devices, function(data) {
        data.logo = new DeviceLogo(data).get();
        return data;
      });
      return devices;
    });
  };

  self.getNodeTypes = function() {
    return $http.get(OCTOBLU_API_URL + '/api/flow_node_types').then(function(res){
      var flowNodeTypes = _.map(res.data, function(data){
        data.logo = new DeviceLogo(data).get()
        return data;
      });
      return flowNodeTypes;
    });
  };

  self.getOtherMatchingFlowNodeTypes = function(type){
    return self.getFlowNodeTypes().then(function(flowNodeTypes){
      return _.where(flowNodeTypes, { type : type });
    });
  };

  return self;
});
