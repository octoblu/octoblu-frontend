var FlowDeploy = function(options){
  var FlowDeploy, Redport, redport, self, mongoose, Flow, _, meshblu;

  self      = this;
  options    = options || {};
  FlowDeploy = options.FlowDeploy || require('../models/flow-deploy');
  Redport    = options.Redport    || require('../models/redport');
  mongoose   = options.mongoose   || require('mongoose');
  meshblu    = options.meshblu
  _          = require('lodash');
  Flow       = mongoose.model('Flow');

  self.startInstance = function(req, res) {
    self.runOnInstance(req, FlowDeploy.start)
    res.send(201);
  };

  self.stopInstance = function(req, res) {
    self.runOnInstance(req, FlowDeploy.stop);
    res.send(200);
  };

  self.restartInstance = function(req, res) {
    self.runOnInstance(req, FlowDeploy.restart);
    res.send(200);
  };

  self.runOnInstance = function(req, cmd){
    var userUUID, userToken;

    userUUID = req.user.skynet.uuid;
    userToken = req.user.skynet.token;

    Flow.findOne({flowId: req.params.id}, function(err, flow){
      cmd(userUUID, userToken, flow, meshblu);
    });
  }

  return this;
};

module.exports = FlowDeploy;
