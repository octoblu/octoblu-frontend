var mongoose = require('mongoose');
var _ = require('lodash');

module.exports = function (options) {
  var _this, NodeType;
  _this = this;

  options = options || {};
  NodeType = options.NodeType || mongoose.model('NodeType');

  _this.getNodeTypes = function (req, res) {
        NodeType.find({ enabled: true,
          $or:[ {"channel.owner":{$exists:false}}, {"channel.owner":new String(req.user._id)}] })
          .exec().then(function (nodeTypes) {
            res.send(nodeTypes);
        }, function (error) {
            console.log(error);
            res.send(500, {error: 'Error searching for NodeTypes'});
        });
    };

  return _this;
};

// module.exports = function (app) {
//     app.get('/api/nodetype', nodeTypeController.getNodeTypes);
// };
