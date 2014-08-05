var _        = require('underscore');
var mongoose = require('mongoose');
var resource = require('./mixins/resource');

var FlowSchema = new mongoose.Schema({
  flowId: String,
  name:   String,
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

  return this.update(query, data, {upsert: true, new: true}).exec();
};

module.exports = FlowSchema;
