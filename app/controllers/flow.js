var mongoose = require('mongoose');

module.exports = function(options) {
  options = options || {};
  var Flow = options.Flow || mongoose.model('Flow');

  this.updateOrCreate = function(req, res) {
    Flow.updateOrCreateByFlowIdAndUser(req.params.id, req.user.skynet.uuid, req.body).then(function(){
      res.send(204);
    }, function(error) {
      res.send(422, error);
    });
  };

  return this;
}
