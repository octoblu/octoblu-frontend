var config = require('../../config/auth'),
  _ = require('lodash');

var FlowCollection = function (Flow) {
  Flow = Flow || require('../models/flow');

  var self = this;
  var User = require('../models/user');

  self.fetch = function (userUUID) {
    return Flow.getFlows(userUUID);
  };
};

module.exports = FlowCollection;
