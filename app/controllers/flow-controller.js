var _ = require('lodash');

module.exports = function (options) {
  var self = this;
  var meshblu, Flow;

  options = options || {};

  Flow    = options.Flow || require('../models/flow');
  meshblu = options.meshblu;

  self.create = function (req, res) {
    Flow.createByUserUUID(req.user.resource.uuid, req.body, meshblu).then(function(flow){
      res.send(201, flow);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.update = function (req, res) {
    Flow.updateByFlowIdAndUser(req.params.id, req.user.resource.uuid, req.body).then(function () {
      res.send(204);
    }, function (error) {
      res.send(422, error);
    });
  };

  self.getAllFlows = function (req, res) {
    return Flow.getFlows(req.user.resource.uuid).then(function(flows){
      res.send(flows);
    }, function(error){
      res.send(500, error);
    });
  };

  self.delete = function (req, res) {
    Flow.deleteByFlowIdAndUser(req.params.id, req.cookies.meshblu_auth_uuid, req.cookies.meshblu_auth_token, meshblu)
      .then(function(){
        res.send(204);
      }, function (err) {
        res.send(500, err);
      });
  };

  return self;
};
