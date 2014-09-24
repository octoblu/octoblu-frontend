var _        = require('lodash');
var mongoose = require('mongoose');
var when     = require('when');
var resource = require('./mixins/resource');

var FlowSchema = new mongoose.Schema({
  flowId: String,
  name:   String,
  zoomScale: Number,
  zoomX: Number,
  zoomY: Number,
  hash:  String,
  nodes: [],
  links: [],
  resource: {
    nodeType: String,
    owner: {
      nodeType: String,
      uuid:     String
    }
  }
});

FlowSchema.statics.deleteByFlowIdAndUserUUID = function(flowId, userUUID){
  return this.remove({flowId : flowId, 'resource.owner.uuid' : userUUID }).exec();
};

var registerFlow = function(meshblu, userUUID){
  return when.promise(function(resolve,reject){
    meshblu.register({owner: userUUID, type: 'octoblu:flow'}, function(data){
      resolve(data);
    });
  });
};

var mergeFlowData = function(userUUID, flowData, device) {
  var data = {
    flowId: device.uuid,
    name: 'Flow ' + device.uuid.substr(0, 8),
    resource: {
      nodeType: 'flow',
      owner: {
        uuid: userUUID,
        nodeType: 'user'
      }
    }
  }
  return _.extend({}, flowData, data);
};

FlowSchema.statics.createByUserUUID = function (userUUID, flowData, meshblu) {
  var self = this;
  return registerFlow(meshblu, userUUID).then(function(device){
    var data = mergeFlowData(userUUID, flowData, device);
    return self.create(data).then(function(){
      return data;
    });
  });
};

FlowSchema.statics.updateByFlowIdAndUser = function (flowId, userUUID, flowData) {
  var query = {flowId: flowId, 'resource.owner.uuid': userUUID};

  return this.update(query, flowData).exec().then(function(numAffected) {
    if (numAffected !== 1) {
      throw new Error('404')
    }
  });
};

module.exports = FlowSchema;
