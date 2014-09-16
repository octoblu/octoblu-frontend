var _        = require('lodash');
var mongoose = require('mongoose');
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

FlowSchema.statics.updateOrCreateByFlowIdAndUser = function (flowId, userUUID, flowData) {
  flowData = flowData || {};
  var query = {flowId: flowId, 'resource.owner.uuid': userUUID};

  var data = _.extend(_.clone(flowData), {
    flowId: flowId,
    resource: {
      nodeType: 'flow',
      owner: {
        uuid: userUUID,
        nodeType: 'user'
      }
    }
  });

  data = _.omit(data, '_id');

  return this.update(query, data, {upsert: true, new: true}).exec();
};

module.exports = FlowSchema;
