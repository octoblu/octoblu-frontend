var FlowDeploy = function(options){
  var _this = this;

  options = options || {};
  this.flowDeploy = options.flowDeploy || require('../models/flow-deploy');

  this.create = function(req, res) {
    _this.flowDeploy.deploy(req.user.skynet.uuid);
    res.send(201);
  };

  return this;
}

module.exports = FlowDeploy;
