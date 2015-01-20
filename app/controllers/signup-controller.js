var _         = require('lodash');
var passport  = require('passport');
var Prefinery = require('../models/prefinery');

var SignupController = function () {
  var self, User;
  self = this;
  self.prefinery = new Prefinery();

  User      = require('../models/user');

  self.checkInTester = function(req, res, next) {
    var testerId = req.param('testerId') || req.session.testerId;
    var sqrtOfSaturn = req.param('sqrtofsaturn') || req.session.sqrtofsaturn;
    if(sqrtOfSaturn || !testerId){
      return next();
    }
    delete req.session.testerId;

    var checkInPromise = self.prefinery.checkInTester(testerId);

    checkInPromise.then(function(){
      console.log('checkInTester returned');
      next();
      // req.user.testerId = testerId;
      // User.update({_id: req.user._id}, req.user).then(function() {
      //   console.log('User.update returned');
      //   next();
      // }).catch(function(error){
      //   console.error(error);
      //   next();
      // });
    });

    checkInPromise.catch(function(error){
      res.send(422, error);
    });
  };

  this.checkForExistingUser = function(req, res, next) {
    User.findByEmail(req.param('email')).then(function(user) {
      if (user) {
        res.send(404, 'User already exists');
        return;
      }
      next();
    });
  };

  this.createUser = function(req, res){
    User.createLocalUser({
      email: req.param('email'),
      password: req.param('password')
    }).then(function(){
      res.send(201, 'User created');
    }).catch(function(error){
      res.send(500, 'Invalid User');
    });
  };

  this.storeTesterId = function(req, res, next){
    req.session.testerId       = req.param('testerId');
    next();
  };

  self.verifyInvitationCode = function (req, res, next) {
    var sqrtOfSaturn = req.param('sqrtofsaturn') || req.session.sqrtofsaturn;
    if(sqrtOfSaturn){
      return next();
    }
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
