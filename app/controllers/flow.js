module.exports = function(options) {
  options = options || {};
  var Flow = options.Flow || null;

  this.findOrCreate = function(req, res) {
    Flow.findOrCreateById(req.params.id, req.body).then(function(){
      res.send(204);
    }, function() {
      res.send(422);
    });
  };

  return this;
}
