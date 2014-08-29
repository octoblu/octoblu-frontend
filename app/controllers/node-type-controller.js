var NodeTypeController = function(options){
  var self, NodeTypeCollection, addResourceType;
  self = this;

  options = options || {};
  NodeTypeCollection = options.NodeTypeCollection;

  self.index = function(req, res){
    NodeTypeCollection.fetch().then(function(nodeTypes){
      res.send(200, addResourceType(nodeTypes));
    }, function(error){
      res.send(500, error);
    });
  }

  addResourceType = function(items){
    return _.map(items, function(item){
      return _.extend({resourceType: 'node-type'}, item);
    });
  }
};

module.exports = NodeTypeController;

// var mongoose = require('mongoose');
// var _ = require('lodash');
// var NodeTypeCollection = require('../collections/node-type-collection');

// module.exports = function (options) {
//   var _this, NodeType;
//   _this = this;

//   options = options || {};
//   NodeType = options.NodeType || mongoose.model('NodeType');

//   // _this.getNodeTypes = function (req, res) {

//   //       NodeType.find({ enabled: true,
//   //         $or:[ {"channel.owner":{$exists:false}}, {"channel.owner":new String(req.user._id)}] })
//   //         .exec().then(function (nodeTypes) {
//   //           res.send(nodeTypes);
//   //       }, function (error) {
//   //           console.log(error);
//   //           res.send(500, {error: 'Error searching for NodeTypes'});
//   //       });
//   //   };

//   return _this;
// };

// // module.exports = function (app) {
// //     app.get('/api/nodetype', nodeTypeController.getNodeTypes);
// };
