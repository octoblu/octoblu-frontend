var FlowDeploy = function(options){
  var FlowDeploy, Redport, redport, _this, mongoose, Flow, _, meshblu;

  _this      = this;
  options    = options || {};
  FlowDeploy = options.FlowDeploy || require('../models/flow-deploy');
  Redport    = options.Redport    || require('../models/redport');
  mongoose   = options.mongoose   || require('mongoose');
  meshblu    = options.meshblu
  _          = require('lodash');
  Flow       = mongoose.model('Flow');

  _this.create = function(req, res) {
    var userUUID, userToken;

    userUUID = req.user.skynet.uuid;
    userToken = req.user.skynet.token;

    _this.getFlows(userUUID, function(flows){
      FlowDeploy.deploy(userUUID, userToken, flows, meshblu);
    });

    res.send(201);
  };

  _this.getFlows = function(userUUID, callback){
    Flow.find({'resource.owner.uuid': userUUID}, function(err, flows){
      callback(_.map(flows, function(flow){
        return flow.toObject();
      }));
    });
  };

  return this;
};

module.exports = FlowDeploy;
