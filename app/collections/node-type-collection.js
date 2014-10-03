var NodeType = require('../models/node-type');
var NodeTypeCollection = function(options){
  var self;
  self = this;

  options  = options || {};


  self.fetch = function() {
    return NodeType.findAll();
  };

  return self;
};

module.exports = NodeTypeCollection;
