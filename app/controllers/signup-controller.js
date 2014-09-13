var _    = require('lodash');
var Prefinery = require('../models/prefinery');

var SignupController = function () {
  var self;
  self = this;
  self.prefinery = new Prefinery();

  self.signup = function (req, res) {
    var testerPromise = self.prefinery.getTester({
      testerId:       req.body.testerId,
      invitationCode: req.body.code
    });

    testerPromise.then(function(tester){
      res.send(201, tester);
    });

    testerPromise.catch(function(error){
      console.log('Darn');
      res.send(401, error);
    });
  };
};

module.exports = SignupController;
