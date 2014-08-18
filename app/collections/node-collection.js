var when              = require('when');
var ChannelCollection = require('./channel-collection');

var NodeCollection = function(userUUID){
  var self = this;

  self.fetch = function(){
    var collection = self.getChannelCollection();

    return collection.fetch();
  };

  self.getChannelCollection = function() {
    return new ChannelCollection(userUUID);
  };

  return self;
};

module.exports = NodeCollection;
