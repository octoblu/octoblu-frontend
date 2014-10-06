var _ = require('lodash');
var mongoose = require('mongoose');
var when = require('when');
var resource = require('./mixins/resource');

var FlowSchema = new mongoose.Schema({
  flowId: String,
  token: String,
  name: String,
  zoomScale: Number,
  zoomX: Number,
  zoomY: Number,
  hash: String,
  nodes: [],
  links: [],
  resource: {
    nodeType: String,
    owner: {
      nodeType: String,
      uuid: String
    }
  }
});

var registerFlow = function (meshblu, userUUID) {
  return when.promise(function (resolve, reject) {
    meshblu.register({owner: userUUID, type: 'octoblu:flow'}, function (data) {
      resolve(data);
    });
  });
};

var unregisterFlow = function (meshblu, flowId, token) {
  return when.promise(function (resolve, reject) {
    meshblu.unregister({uuid: flowId, token: token}, function (data) {
      resolve(data);
    });
  });
};

var mergeFlowData = function (userUUID, flowData, device) {
  var data = {
    flowId: device.uuid,
    token: device.token,
    name: 'Flow ' + device.uuid.substr(0, 8),
    resource: {
      nodeType: 'flow',
      owner: {
        uuid: userUUID,
        nodeType: 'user'
      }
    }
  };
  return _.extend({}, data, flowData);
};

FlowSchema.statics.createByUserUUID = function (userUUID, flowData, meshblu) {
  var self = this;
  return registerFlow(meshblu, userUUID).then(function (device) {
    var data = mergeFlowData(userUUID, flowData, device);
    return self.create(data).then(function () {
      return data;
    });
  });
};

FlowSchema.statics.deleteByFlowIdAndUserUUID = function (flowId, userUUID, meshblu) {
  var query, self;
  var FlowDeploy = require('./flow-deploy');
  self = this;
  query = {flowId: flowId};

  return self.findOne(query).exec().then(function (flow) {
    FlowDeploy.stop(userUUID, flow, meshblu);
    return unregisterFlow(meshblu, flow.flowId, flow.token).then(function () {
      return self.remove(query).exec();
    })
  });
};

FlowSchema.statics.updateByFlowIdAndUser = function (flowId, userUUID, flowData) {
  var escapedFlowData = escapeFlowData(flowData);

  var query = {flowId: flowId, 'resource.owner.uuid': userUUID};

  return this.update(query, escapedFlowData).exec().then(function (numAffected) {
    if (numAffected !== 1) {
      throw new Error('404')
    }
  });
};

FlowSchema.statics.getFlows = function (userUUID) {
  var self = this;
  return self.find({'resource.owner.uuid': userUUID}).lean().exec().then(
    function(flows){
      return _.map(flows, unescapeFlowData);
    });
};

FlowSchema.statics.getFlow = function (flowId) {
  var self = this;
  return self.findOne({'flowId': flowId}).lean().exec().then(
    function(flow){
      return unescapeFlowData(flow);
    });
};


function escapeFlowData(flowData) {
  var escapedFlowData = _.clone(flowData);
  escapedFlowData.nodes = _.map(flowData.nodes, function (node) {
    return escapeNodeProperties(node);
  });

  return escapedFlowData;
}

function unescapeFlowData(flowData) {
  var unescapedFlowData = _.clone(flowData);
  unescapedFlowData.nodes = _.map(flowData.nodes, function (node) {
    return unescapeNodeProperties(node);
  });

  return unescapedFlowData;
}

function escapeNodeProperties(node) {
  if(!_.isObject(node)) {
    return node;
  }

  var newNode = {};
  _.each(_.keys(node), function (key) {
    var newKey = key.replace(/\./g, '%2E');
    newNode[newKey] = escapeNodeProperties(node[key]);
  });
  return newNode;
}

function unescapeNodeProperties(node) {
  if(!_.isObject(node)) {
    return node;
  }

  var newNode = {};

  _.each(_.keys(node), function (key) {
    var newKey = key.replace(/%2E/g, '.');
    newNode[newKey] = unescapeNodeProperties(node[key]);
  });

  return newNode;
}

module.exports = FlowSchema;
