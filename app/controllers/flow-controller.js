var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function (options) {
  var _this, Flow;
  _this = this;

  options = options || {};
  Flow = options.Flow || mongoose.model('Flow');

  _this.updateOrCreate = function (req, res) {
    Flow.updateOrCreateByFlowIdAndUser(req.params.id, req.user.resource.uuid, req.body).then(function () {
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
    if (!req.user || !req.user.resource.uuid) {
      return res.send(401);
    }
    if (!req.params.id) {
      res.send(422)
    }
    Flow.deleteByUserIdAndFlowId(req.user.resource.uuid, req.id)
      .then(null, function (err) {
        res.send(401);
      });
  };

  return _this;
};
