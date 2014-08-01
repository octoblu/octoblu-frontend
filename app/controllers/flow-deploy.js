var FlowDeploy = function(options){
  var FlowDeploy, Redport, redport, _this;

  _this      = this;
  options    = options || {};
  FlowDeploy = options.FlowDeploy || require('../models/flow-deploy');
  Redport    = options.Redport    || require('../models/redport');
  mongoose   = options.mongoose   || require('mongoose');
  Flow       = mongoose.model('Flow');

  _this.create = function(req, res) {
    var userUUID, userToken;

    userUUID = req.user.skynet.uuid;
    userToken = req.user.skynet.token;
    getRedport(userUUID, userToken, function(error, port){
      _this.getFlows(userUUID, function(flows){
        FlowDeploy.deploy(userUUID, userToken, port, flows);
      });
    });

    res.send(201);
  };

  getRedport = function(userUUID, userToken, callback){
    var redport = new Redport({userUUID: userUUID, userToken: userToken});
    redport.redport(function(port){
      callback(null, port);
    });
  }

  _this.getFlows = function(userUUID, callback){
    Flow.find({'resource.owner.uuid': userUUID}, function(err, flows){
      callback(_.map(flows, function(flow){
        return flow.toObject();
      }));
    });
  }

  return this;
}

module.exports = FlowDeploy;
