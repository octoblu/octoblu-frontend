var when     = require('when');
var mongoose = require('mongoose');

var NodeTypeCollection = function(options){
  var self, query, NodeType;
  self = this;

  options  = options || {};
  mongoose = options.mongoose || mongoose;
  NodeType = mongoose.model('NodeType');

  query    = {
    enabled: true,
    $or: [
      { "channel.owner": { $exists: false } },
      { "channel.owner": new String(req.user._id) }
    ]
  }

  self.fetch = function() {
    return when(NodeType.find(query).exec());
  };

  return self;
};

module.exports = NodeTypeCollection;
