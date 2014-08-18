var FlowNodeTypeCollection = require('../collections/flow-node-type-collection');

module.exports = function (options) {
  var self = this;
  this.getFlowNodeTypes = function (req, res) {
    var flowNodeTypeCollection = self.getFlowNodeTypeCollection(req.user.resource.uuid);
    flowNodeTypeCollection.fetch().then(function (flowNodeTypes) {
      res.send(flowNodeTypes[0]);
    });
  };

  this.getFlowNodeTypeCollection = function (userUUID) {
    return new FlowNodeTypeCollection(userUUID);
  };

  return self;
};
