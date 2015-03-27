angular.module('octobluApp')
.service('FlowNodeTypeService', function ($http, $q, UUIDService, NodeService) {
  'use strict';

  var self = this;

  self.createFlowNode = function(flowNodeType){
    var defaults = _.cloneDeep(flowNodeType.defaults);

    return _.defaults({id: UUIDService.v1(), resourceType: 'flow-node'}, defaults, flowNodeType);
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

  self.getFlowNodeTypes = function(cache) {
    return $http.get('/api/flow_node_types').then(function(res){
      return _.map(res.data, function(data){
        if (data && data.type) {
          data.logo = 'https://ds78apnml6was.cloudfront.net/' + data.type.replace(':', '/') + '.svg';
        }
        return data;
      });
    });
  };

  self.getOtherMatchingFlowNodeTypes = function(type){
    return self.getFlowNodeTypes(true).then(function(flowNodeTypes){
      return _.where(flowNodeTypes, { type : type });
    });
  };

  function getSubdeviceFlowNodeTypes() {
    return NodeService.getSubdeviceNodes().then(function(subdevices){
      return _.map(subdevices, function(subdevice){
        return self.convertSubdevice(subdevice);
      });

    });
  }

  //"borrowed" from the back end until we can query subdevices on the backend.
  // Can we give it back now?
  self.convertSubdevice = function(node) {
    return {
      name: node.name,
      category: 'device',
      class: node.name,
      type: node.type,
      logo: node.logo,
      uuid: node.uuid,
      defaults: {
        logo: node.logo,
        category: 'device',
        uuid: node.uuid,
        schema: node && node.plugin ? node.plugin.messageSchema : {},
        useStaticMessage: true,
        staticMessage: {},
        type: node.type
      },
      resourceType: 'flow-node-type',
      input: 1,
      output: 1,
      formTemplatePath: "/pages/node_forms/subdevice_form.html"
    };
  };

  return self;
});

