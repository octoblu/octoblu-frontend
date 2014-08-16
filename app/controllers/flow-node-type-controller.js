var FlowNodeTypeCollection = require('../collections/flow-node-type-collection');

module.exports = function(options) {

  this.getFlowNodeTypes = function(req, res) {
    var flowNodeTypeCollection = this.getFlowNodeTypeCollection('1234');
    flowNodeTypeCollection.fetch().then(res.send);
  };

  this.getFlowNodeTypeCollection = function(userUUID){
    return new FlowNodeTypeCollection(userUUID);
  };

  return this;
};
