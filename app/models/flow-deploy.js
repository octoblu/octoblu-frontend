var _ = require('lodash'),
DeviceCollection = require('../collections/device-collection');

var FlowDeploy = function(options){
  var LEGACY_TYPES = {
    'button'   : 'inject',
    'interval' : 'inject',
    'schedule' : 'inject'
  };

  var self, config, request, userUUID, userToken, meshblu, tranformations;
  self = this;

  options         = options || {};

  userUUID        = options.userUUID;
  userToken       = options.userToken;
  config          = options.config  || require('../../config/auth')(process.env.NODE_ENV).designer;
  request         = options.request || require('request');
  meshblu         = options.meshblu;
  transformations = options.transformations || require('./node-red-transformations');

  self.convertFlow = function(flow){
    var convertedNodes = [];

    convertedNodes.push({id: flow.flowId, label: flow.name, type: 'tab'});

    _.each(flow.nodes, function(node){
      convertedNodes.push(self.convertNode(flow, node));
    });

    return convertedNodes;
  };

  self.convertNode = function(flow, node){
    var convertedNode, nodeLinks, groupedLinks, largestPort;

    nodeLinks           = _.where(flow.links, {from: node.id});
    groupedLinks        = _.groupBy(nodeLinks, 'fromPort');
    largestPort         = self.largestPortNumber(groupedLinks);

    convertedNode = _.clone(node);
    convertedNode.z = flow.flowId;
    convertedNode.wires = self.paddedArray(largestPort);

    convertedNode.type = LEGACY_TYPES[convertedNode.type] || convertedNode.type;

    _.each(groupedLinks, function(links, fromPort){
      var port = parseInt(fromPort);
      convertedNode.wires[port] = _.pluck(links, 'to');
    });

    return self.finalTransformation(convertedNode);
  };

  self.startFlow = function(flow, token){
    self.sendMessage(flow, token, 'nodered-instance-start');
  };

  self.stopFlow = function(flow, token){
    self.sendMessage(flow, token, 'nodered-instance-stop');
  };

  self.restartFlow = function(flow, token){
    self.sendMessage(flow, token, 'nodered-instance-restart');
  };

  self.sendMessage = function(flow, token, topic) {
    meshblu.devices({}, function(data){
      managerDevices = _.where(data.devices, {type: 'nodered-docker-manager'});
      devices = _.pluck(managerDevices, 'uuid');
      var msg = {
        devices: devices,
        topic: topic,
        qos: 0
      };
      msg.payload = {
        uuid: flowDevice.uuid,
        token: token,
        flow: self.convertFlow(flow)
      };
      meshblu.message(msg);
    });
  };

  self.finalTransformation = function(node){
    var func = transformations[node.type];
    if(!func){ return node; }

    return func(node);
  };

  self.largestPortNumber = function(groupedLinks){
    var portsKeys = _.keys(groupedLinks);
    var ports = _.map(portsKeys, function(portKey){ return parseInt(portKey); } );
    return _.max(ports);
  };

  self.paddedArray = function(length){
    return _.map(_.range(length), function(){
      return [];
    });
  };

  self.registerFlow = function(flow, callback) {
    meshblu.register({uuid: flow.flowId, type: 'octoblu:flow', owner: userUUID}, callback);
  };

  self.unregisterFlow = function(flow, token, callback) {
    meshblu.unregister({uuid: flow.flowId, token: token}, callback);
  };
};

FlowDeploy.start = function(userUUID, userToken, flow, meshblu){
  var flowDeploy;

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshblu: meshblu});
  deviceCollection = new DeviceCollection(userUUID);
  deviceCollection.fetch().then(function(myDevices){
    flowDevice = _.findWhere(myDevices, {uuid: flow.flowId});
    if (flowDevice) {
      flowDeploy.startFlow(flow, flowDevice.token);
    } else {
      flowDeploy.registerFlow(flow, function(flowDevice){
        flowDeploy.startFlow(flow, flowDevice.token);
      });
    }
  });
};

FlowDeploy.stop = function(userUUID, userToken, flow, meshblu){
  var flowDeploy;

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshblu: meshblu});
  deviceCollection = new DeviceCollection(userUUID);
  deviceCollection.fetch().then(function(myDevices){
    flowDevice = _.findWhere(myDevices, {uuid: flow.flowId});
    if (flowDevice) {
      flowDeploy.unregisterFlow(flow, function(flowDevice){
        flowDeploy.stopFlow(flow, flowDevice.token);
      });
    }
  });
};

FlowDeploy.restart = function(userUUID, userToken, flow, meshblu){
  var flowDeploy;

  FlowDeploy.stop(userUUID, userToken, flow, meshblu);
  FlowDeploy.start(userUUID, userToken, flow, meshblu);
};

module.exports = FlowDeploy;
