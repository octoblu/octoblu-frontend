var mongoose = require('mongoose');
var resource = require('./mixins/resource');

var FlowSchema = new mongoose.Schema({
  flowId: String,
  nodes: [],
  links: []
});

resource.makeResourceModel({schema: FlowSchema});

FlowSchema.statics.updateOrCreateByFlowIdAndUser = function (flowId, userUUID) {
  return this.create({
    flowId: flowId,
    resource: {
      type: 'flow',
      owner: {
        uuid: userUUID,
        type: 'user'
      }
    }
  });
};

module.exports = FlowSchema;
