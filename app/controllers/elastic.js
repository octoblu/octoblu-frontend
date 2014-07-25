'use strict';

var mongoose = require('mongoose'),
    request  = require('request'),
    Event = mongoose.model('Event');

module.exports = function (app) {

  app.get('/api/events', function (req, res) {

    Event.find({}, function (err, events) {
      if (err) { res.send(err); } else { res.json(events); }
    });

  });

  app.all('/api/elastic/skynet_trans_log/_search', function(req, res){
    request({
      url:    'http://es.octoblu.com/skynet_trans_log/_search',
      method: req.method,
      json:   req.body
    }, function(error, incomingMessage, response){
      res.send(incomingMessage.statusCode, response);
    });
  });
};
