var config = require('../../config/auth')(),
  mongoose = require('mongoose'),
  _ = require('lodash');

var FlowCollection = function (Flow) {
  Flow = Flow || require('../models/flow');

  var self = this;
  var User = mongoose.model('User');

  self.fetch = function (userUUID) {
    return Flow.getFlows(userUUID);
  };
};

module.exports = FlowCollection;
