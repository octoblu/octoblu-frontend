'use strict';
var User          = require('../app/models/user');
var LocalStrategy = require('passport-local').Strategy;
var _             = require('lodash');

var ensureUser = function(email, password, callback){
  var query, userParams;

  query = {'local.email': email};

  userParams = {
    email: email,
    password: password
  };

  User.findOne(query).then(function(user) {
    if (!_.isEmpty(user)){

      if (!User.validPassword(user, password)) {
        callback(new Error('Invalid Password'));
      }

      callback(null, user);
      return;
    }

    if (!req.session.testerId) {
      callback(new Error('You must have a valid invitation code'));
      return;
    }

    User.createLocalUser(userParams).then(function(user){
      callback(null, user);
    });

  }).catch(function(error){
    callback(error);
  });
};

var localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, ensureUser);

module.exports = localStrategy;
