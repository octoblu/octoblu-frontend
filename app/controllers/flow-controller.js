var mongoose = require('mongoose');
var _ = require('lodash');

module.exports = function (options) {
  var _this, meshblu, Flow;
  _this = this;

  options = options || {};

  Flow    = options.Flow || mongoose.model('Flow');
  meshblu = options.meshblu;

  _this.create = function (req, res) {
    Flow.createByUserUUID(req.user.resource.uuid, req.body, meshblu).then(function(flow){
      res.send(201, flow);
    }, function(error) {
      res.send(422, error);
    });
  };

  _this.update = function (req, res) {
    Flow.updateByFlowIdAndUser(req.params.id, req.user.resource.uuid, req.body).then(function () {
      res.send(204);
    }, function (error) {
      res.send(422, error);
    });
  };

  _this.getAllFlows = function (req, res) {
    return _this.getFlows(req.user.resource.uuid, function (error, flows) {
      if (error) {
        return res.send(500, error);
      }
      res.send(flows);
    });
  };

  _this.getFlows = function (userUUID, callback) {
    Flow.find({'resource.owner.uuid': userUUID}, function (err, flows) {
      callback(err, _.map(flows, function (flow) {
        return flow.toObject();
      }));
    });
  };

  _this.delete = function (req, res) {
    Flow.deleteByFlowIdAndUserUUID(req.params.id, req.user.resource.uuid, meshblu)
      .then(function(){
        res.send(204);
      }, function (err) {
        res.send(500, err);
      });
  };

  return _this;
};
