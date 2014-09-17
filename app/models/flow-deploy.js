var _ = require('lodash'),
    FlowDeviceCollection = require('../collections/flow-device-collection'),
    mongoose = require('mongoose');

var FlowDeploy = function(options){
  var LEGACY_TYPES = {
    'trigger'  : 'inject',
    'interval' : 'inject',
    'schedule' : 'inject'
  };

  var User = mongoose.model('User');

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

    convertedNodes.push({id: flow.flowId, label: flow.name, type: 'tab', hash: flow.hash});

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
    convertedNode.hash = flow.hash;
    convertedNode.wires = self.paddedArray(largestPort);
    if (convertedNode.category === 'operation') {
      convertedNode.type = LEGACY_TYPES[convertedNode.type] || convertedNode.type
    } else {
      convertedNode.type = convertedNode.category;
    }

    _.each(groupedLinks, function(links, fromPort){
      var port = parseInt(fromPort);
      convertedNode.wires[port] = _.pluck(links, 'to');
    });

    return self.finalTransformation(convertedNode);
  };

  self.getUser = function (userUUID) {
    return User.findLeanBySkynetUUID(userUUID);
  };

  self.mergeFlowTokens = function(flow, userApis, channelApis) {
    _.each(flow.nodes, function(node){
      node.oauth = {};
      var userApiMatch = _.findWhere(userApis, {'_id': new mongoose.Types.ObjectId(node.channelActivationId)});
      if (userApiMatch) {
        node.oauth.access_token = userApiMatch.token;
        node.oauth.access_token_secret = userApiMatch.secret;
      }
      var channelApiMatch = _.findWhere(channelApis, {'_id': node.channelid});
      if (channelApiMatch && channelApiMatch.oauth) {
        var channelOauth = channelApiMatch.oauth[process.env.NODE_ENV] || channelApiMatch.oauth;
        node.application = {base: channelApiMatch.application.base};
        node.bodyFormat = channelApiMatch.bodyFormat;
        node.oauth = _.defaults(node.oauth, channelOauth);
        node.oauth.key = node.oauth.key || node.oauth.clientID || node.oauth.consumerKey;
        node.oauth.secret = node.oauth.secret || node.oauth.clientSecret || node.oauth.consumerSecret;
      }
    });
    return flow;
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
    meshblu.mydevices({}, function(data){
      managerDevices = _.where(data.devices, {type: 'nodered-docker-manager'});
      devices = _.pluck(managerDevices, 'uuid');
      var msg = {
        devices: devices,
        topic: topic,
        qos: 0
      };
      msg.payload = {
        uuid: flow.flowId,
        token: token,
        flow: self.convertFlow(flow)
      };
      meshblu.message(msg);
    });
  };

  self.finalTransformation = function(node){
    var func = transformations[node.category];
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

  self.registerFlow = function(flowId, callback) {
    meshblu.register({uuid: flowId, type: 'octoblu:flow', owner: userUUID}, callback);
  };

  self.unregisterFlow = function(flowId, token) {
    meshblu.unregister({uuid: flowId, token: token});
  };
};

FlowDeploy.start = function(userUUID, userToken, flow, meshblu){
  var flowDeploy, mergedFlow, flowDevice, user;
  var Channel = require('../models/channel');

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshblu: meshblu});
  return flowDeploy.getUser(userUUID).then(function(theUser){
    user = theUser;
    return Channel.findAll();
  }).then(function(channels){
    mergedFlow = flowDeploy.mergeFlowTokens(flow, user.api, channels);

    deviceCollection = new FlowDeviceCollection(userUUID);
    deviceCollection.fetch().then(function(myDevices){
      flowDevice = _.findWhere(myDevices, {uuid: flow.flowId});
      if (flowDevice) {
        flowDeploy.startFlow(mergedFlow, flowDevice.token);
      } else {
        flowDeploy.registerFlow(flow.flowId, function(flowDevice){
          flowDeploy.startFlow(mergedFlow, flowDevice.token);
        });
      }
    });
  }, function(error){
    console.log('Error', error);
    throw new Error(error);
  });
};

FlowDeploy.stop = function(userUUID, userToken, flow, meshblu){
  var flowDeploy, flowDevice;

  try {
  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, meshblu: meshblu});
  deviceCollection = new FlowDeviceCollection(userUUID);
  deviceCollection.fetch().then(function(myDevices){
    flowDevice = _.findWhere(myDevices, {uuid: flow.flowId});
    if (flowDevice) {
      flowDeploy.stopFlow(flow, flowDevice.token);
      flowDeploy.unregisterFlow(flow.flowId);
    }
  });
} catch (err) {
  console.log(err);
  throw err;
}
};

FlowDeploy.restart = function(userUUID, userToken, flow, meshblu){
  var flowDeploy;
  FlowDeploy.stop(userUUID, userToken, flow, meshblu);
  FlowDeploy.start(userUUID, userToken, flow, meshblu);
};

module.exports = FlowDeploy;
