var _ = require('lodash');

var SignupController = function () {
  var self;
  self = this;

  self.signup = function (req, res) {
    self.prefinery.getTester();
    res.send(401);

  };

};

module.exports = SignupController;
