'use strict';

var nodemailer    = require('nodemailer'),
    request       = require('request'),
    security      = require('./middleware/security'),
    User          = require('../models/user');

module.exports = function ( app, passport, config ) {

  app.post('/api/reset', security.bypassAuth, security.bypassTerms, function(req, res, next) {
    var user;
    User.findByEmail(req.body.email)
      .then(function(dbUser){
        user = dbUser;

        if (!user) {
          throw {code: 404, errors: {email: ['No account with that email address exists.']}};
        }

        return User.generateToken();
      })
      .then(function(token){
        user.resetPasswordToken   = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        return user.saveWithPromise();
      })
      .then(function(){
        var smtpTransport, mailOptions;

        smtpTransport = nodemailer.createTransport("SMTP", {
          service: "Gmail",
          auth: {
            user: config.email.SMTP.Gmail.user,
            pass: config.email.SMTP.Gmail.password
          }
        });

        mailOptions = {
          to: user.email,
          subject: 'Octoblu Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + user.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        smtpTransport.sendMail(mailOptions, function(error) {
           if (error) { throw {code: 500, errors: {all: [error]}} }
           res.send(201);
        });

      }).catch(function(options){
        if(options.code) {
          return res.send(options.code, {errors: options.errors});
        }
        return res.send(500, {errors: options.errors, arguments: arguments});
      });
  });

  app.put('/api/reset/:token', function(req, res, next){
    User.findByResetToken(req.params.token).then(function(user){
      if(!user){
        return res.send(404, {error: 'Password reset token is invalid or has expired.', arguments: arguments});
      }

      user.local.password       = User.generateHash(user, req.body.password);
      user.resetPasswordToken   = null;
      user.resetPasswordExpires = null;

      return User.update({_id: user._id}, user).then(function(returnedUser) {
        return res.send(204);
      });
    }).catch(function(error){
      return res.send(404, {error: error});
    });
  });
};
