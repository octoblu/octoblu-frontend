'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Event');

module.exports = function (app) {

  app.get('/api/events', function (req, res) {

    Event.find({}, function (err, events) {
      if (err) { res.send(err); } else { res.json(events); }
    });

  });

};
