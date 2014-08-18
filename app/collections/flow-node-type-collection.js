var NodeCollection = require('./node-collection');
var when = require('when');
var _ = require('lodash');

var FlowNodeTypeCollection = function(userUUID, options){
  var self, fs, userUUID;
  self = this;

  options  = options || {};
  fs       = options.fs || require('fs');
  userUUID = userUUID;

  self.fetch = function(){
    var collection = self.getNodeCollection(userUUID);

    return when.all([/*collection.fetch(),*/ self.fromFile()]).then(function(responseArrays){
      return _.flatten(responseArrays, true);
    });
  };

  self.fromFile = function(){
    var promise = when.promise(function(resolve){
      fs.readFile('assets/json/flow-node-types.json', {encoding: 'utf8'}, function(error, nodeTypes){
        resolve(JSON.parse(nodeTypes));
      });
    });

    return promise;
  };

  self.fromNodes = function(){
    var nodeCollection = self.getNodeCollection();

    return nodeCollection.fetch().then(function(nodes){
      return nodes;
    });
  };

  self.getNodeCollection = function(){
    return new NodeCollection(userUUID);
  };

  return self;
};

module.exports = FlowNodeTypeCollection;
