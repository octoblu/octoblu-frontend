module.exports = function(options) {
  options = options || {};
  var Flow = options.Flow || null;

  this.updateOrCreate = function(req, res) {
    Flow.updateOrCreateByFlowIdAndUser(req.params.id, req.user.skynet.uuid, req.body).then(function(){
      res.send(204);
    }, function() {
      res.send(422);
    });
  };

  return this;
}
