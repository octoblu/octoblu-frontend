var when     = require('when');
var mongoose = require('mongoose');

var NodeTypeCollection = function(options){
  var self = this;

  options  = options || {};
  mongoose = options.mongoose || mongoose;
  var NodeType  = mongoose.model('NodeType');

  self.fetch = function() {
    return when(NodeType.find().exec());
  };

  return self;
};

module.exports = NodeTypeCollection;
