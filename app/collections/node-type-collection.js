var when     = require('when');
var mongoose = require('mongoose');
var dummyNodeTypes = require('./dummy-node-types');
var _ = require('lodash');
var NodeTypeCollection = function(options){
  var self, query, NodeType;
  self = this;

  options  = options || {};
  mongoose = options.mongoose || mongoose;
  NodeType = mongoose.model('NodeType');


  self.fetch = function(userId) {
    return when(NodeType.find(query(userId)).lean().exec()).then(function(nodetypes){
      return _.union(nodetypes, dummyNodeTypes);
    });
  };

  query = function(userId){
    return {
      enabled: true,
      $or: [
        { "channel.owner": { $exists: false } },
        { "channel.owner": new String(userId) }
      ]
    }
  }

  return self;
};

module.exports = NodeTypeCollection;
