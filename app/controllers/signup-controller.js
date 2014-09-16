var _         = require('lodash');
var passport  = require('passport');
var Prefinery = require('../models/prefinery');

var SignupController = function () {
  var self;
  self = this;
  self.prefinery = new Prefinery();

  self.checkInTester = function(req, res, next) {
    var checkInPromise = self.prefinery.checkInTester(req.body.testerId);

    checkInPromise.then(function(){
      req.user.testerId = req.body.testerId;
      req.user.save(function(error) {
        if(error){
          throw error;
        }
        next();
      });
    });

    checkInPromise.catch(function(error){
      res.send(422, error);
    });
  };

  self.createUser = function(user) {
    User.findOrCreateByEmailAndPassword(email, password).then(function(user){
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  };

  self.loginUser = passport.authenticate('local');

  this.returnUser = function(req, res){
    res.send(201, req.user);
  };

  self.verifyInvitationCode = function (req, res, next) {
    var testerPromise = self.prefinery.getTester({
      testerId:       req.body.testerId,
      invitationCode: req.body.invitationCode
    });

    testerPromise.then(function(){
      next();
    });

    testerPromise.catch(function(error){
      res.send(422, error);
    });
  };
};

module.exports = SignupController;
