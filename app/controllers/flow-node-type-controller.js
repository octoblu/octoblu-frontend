var _ = require('lodash');
var FlowNodeTypeCollection = require('../collections/flow-node-type-collection');

module.exports = function (options) {
  var self, addResourceType;
  self = this;

  this.getFlowNodeTypes = function (req, res) {
    var uuid = req.cookies.meshblu_auth_uuid;
    var token = req.cookies.meshblu_auth_token;
    var flowNodeTypeCollection = self.getFlowNodeTypeCollection(uuid, token);
    flowNodeTypeCollection.fetch().then(function (flowNodeTypes) {
      res.send(200, addResourceType(flowNodeTypes));
    });
  };

  this.getFlowNodeTypeCollection = function (uuid, token) {
    return new FlowNodeTypeCollection(uuid, token);
  };

  addResourceType = function(items){
    return _.map(items, function(item){
      return _.extend({resourceType: 'flow-node-type'}, item);
    });
  };

  return self;
};
