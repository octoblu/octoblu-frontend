var config = require('../../config/auth')(),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  Flow = mongoose.model('Flow');

var FlowCollection = function () {
  var self = this;
  var User = mongoose.model('User');

  self.fetch = function (userUUID) {
    return Flow.getFlows(userUUID);
  };
};

module.exports = FlowCollection;
