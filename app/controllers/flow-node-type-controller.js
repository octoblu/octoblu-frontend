var _ = require('lodash');
var FlowNodeTypeCollection = require('../collections/flow-node-type-collection');

module.exports = function (options) {
  var self = this;

  this.getFlowNodeTypes = function (req, res) {
    var flowNodeTypeCollection = self.getFlowNodeTypeCollection(req.user.resource.uuid);
    flowNodeTypeCollection.fetch().then(function (flowNodeTypes) {
      res.send(200, addResourceType(flowNodeTypes));
    });
  };

  this.getFlowNodeTypeCollection = function (userUUID) {
    return new FlowNodeTypeCollection(userUUID);
  };

  addResourceType = function(items){
    return _.map(items, function(item){
      return _.extend({resourceType: 'flow-node-type'}, item);
    });
  }

  return self;
};
