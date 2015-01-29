'use strict';

var nodemailer       = require('nodemailer');
var request          = require('request');
var security         = require('./middleware/security');
var User             = require('../models/user');
var PasswordResetter = require('../models/password-resetter');

module.exports = function ( app, passport, config ) {

  app.post('/api/reset', function(req, res, next) {
    var passwordResetter = new PasswordResetter;
    passwordResetter.resetByEmail(req.body.email, req.headers.host).then(function(){
      res.send(res.send(201));
    }).catch(function(error){
      res.send(500, error);
    });
  });

  app.put('/api/reset/:token', function(req, res, next){    
    User.findByResetToken(req.params.token).then(function(user){
      if(!user){
        return res.send(402, {error: 'Password reset token is invalid or has expired.', arguments: arguments});
      }

      user.local.password       = User.generateHash(req.body.password);
      user.resetPasswordToken   = null;
      user.resetPasswordExpires = null;

      return User.update({_id: user._id}, user).then(function(returnedUser) {
        return res.send(204);
      });
    }).catch(function(error){
      return res.send(402, {error: error});
    });
  });

  app.post('/api/reset-token', security.isAuthenticated, function(req, res, next){
    User.resetToken(req.user.skynet.uuid).then(function(token){
      res.send(token);
    }).catch(function(err){
      res.send(500, err);
    });
  });
};
