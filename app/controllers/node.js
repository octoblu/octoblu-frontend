var mongoose = require('mongoose'),
    NodeType = mongoose.model('NodeType');
isAuthenticated = require('./middleware/security').isAuthenticated;
var nodeTypeController = {
    getNodeTypes: function (req, res) {
        NodeType.find({ enabled: true }).exec().then(function (nodeTypes) {
            res.send(nodeTypes);
        }, function (error) {
            console.log(error);
            res.send(500, {error: 'Error searching for NodeTypes'});
        });
    }
};

module.exports = function (app) {
    app.get('/api/nodetype', nodeTypeController.getNodeTypes);
};