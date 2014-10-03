var _         = require('lodash');
var passport  = require('passport');
var Prefinery = require('../models/prefinery');

var SignupController = function () {
  var self, mongoose, User;
  self = this;
  self.prefinery = new Prefinery();

  mongoose  = require('mongoose');
  User      = mongoose.model('User');

  self.checkInTester = function(req, res, next) {
    var testerId = req.param('testerId') || req.session.testerId;
    if(!testerId){
      return next();
    }
    delete req.session.testerId;

    var checkInPromise = self.prefinery.checkInTester(testerId);

    checkInPromise.then(function(){
      req.user.testerId = testerId;
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

  self.createUser = function(req, res, next) {
    User.findOrCreateByEmailAndPassword(req.body.email, req.body.password).then(function(user){
      req.user = user;
      next();
    }).catch(function(error){
      res.send(422, error);
    });
  };

  self.loginUser = passport.authenticate('local');

  this.returnUser = function(req, res){
    res.send(201, req.user);
  };

  this.storeTesterId = function(req, res, next){
    req.session.testerId       = req.param('testerId');
    next();
  };

  self.verifyInvitationCode = function (req, res, next) {
    var testerPromise = self.prefinery.getTester({
      testerId:       req.param('testerId'),
      invitationCode: req.param('invitationCode')
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
