var WebhookController = function(options) {
  var self, meshblu;
  self = this;

  options = options || {};
  meshblu = options.meshblu;
  Flow    = require('../models/flow');

  self.trigger = function(req, res) {
    var query = {'nodes.id': req.params.id};
    Flow.findOne(query).then(function(flow){
      var msg = {
        devices: [flow.flowId],
        topic: 'webhook',
        qos: 0,
        payload: {
          from: req.params.id,
          params: req.body
        }
      };
   
      meshblu.message(msg);
      res.send(201);
    }).then(null, function(err){
      res.send(404);
    });
  }

  return self;
}

module.exports = WebhookController
