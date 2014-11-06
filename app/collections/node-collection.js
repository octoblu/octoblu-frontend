var _ = require('lodash');
var when = require('when');
var ChannelCollection  = require('./channel-collection');
var DeviceCollection   = require('./device-collection');
var FlowCollection   = require('./flow-collection');
var NodeTypeCollection = require('./node-type-collection');
var config = require('../../config/auth')();

var NodeCollection = function (userUUID) {
  var self = this;

  self.mergedNodes = function(){
    return when.all([self.getDevices(), self.getChannels(), self.getFlows()]).then(function (nodeResults) {
      return _.flatten(nodeResults, true);
    });
  };

  self.fetch = function () {
    return self.mergedNodes().then(self.mergeNodeTypes);
  };

  self.getChannelCollection = function () {
    return new ChannelCollection();
  };

  self.getDevices = function () {
    var deviceCollection = self.getDeviceCollection();

    return deviceCollection.fetch()
    .then(function (devices) {
      return _.map(devices, self.convertDeviceToNode);
    });
  };

  self.getChannels = function () {
    var channelCollection = self.getChannelCollection();

    return channelCollection.fetch(userUUID)
    .then(function (channels) {
      return _.map(channels, self.convertChannelToNode);
    });
  };

  self.getFlows = function () {
    var FlowCollection = self.getFlowCollection();
    return FlowCollection.fetch(userUUID)
    .then(function (flows) {
      return _.map(flows, self.convertFlowToNode);
    });

  };

  self.mergeNodeTypes = function(nodes){
    var nodeTypeCollection = self.getNodeTypeCollection();
    return nodeTypeCollection.fetch().then(function(nodeTypes){
      return _.map(nodes, function(node){
        var logo, nodeType;
        nodeType = _.findWhere(nodeTypes, {type: node.type});
        if(nodeType) {
          node.category = nodeType.category;
        }
        node.nodeType = {};
        return node;
      });

    });
  };

  self.convertChannelToNode = function(channel) {
    return _.extend({}, channel, {
      category: 'channel',
      online: true
    });
  };

  self.convertDeviceToNode = function (device) {
    return _.extend({}, device, {
      category: 'device',
      staticMessage: {},
      useStaticMessage: true
    });
  };

  self.convertFlowToNode = function (flow) {
    return {
      name: flow.name,
      uuid: flow.flowId,
      category: 'device',
      type: 'device:flow',
      staticMessage: {},
      topic: 'message',
      useStaticMessage: false,
      triggers: _.map( _.find(flow.nodes, {type: 'operation:trigger'}), function(trigger){
        return {
          name: trigger.name,
          uuid: trigger.uuid
        };
      })
    };
  };

  self.getDeviceCollection = function () {
    return new DeviceCollection(userUUID);
  };

  self.getFlowCollection = function () {
    return new FlowCollection(userUUID);
  };

  self.getNodeTypeCollection = function () {
    return new NodeTypeCollection(userUUID);
  };

  return self;
};

module.exports = NodeCollection;
