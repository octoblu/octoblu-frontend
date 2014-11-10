var User          = require('../app/models/user');
var LocalStrategy = require('passport-local').Strategy;

var ensureUser = function(email, password, done){
  User.createLocalUser({email: email, password: password}).then(function(user){
    done(null, user);
  }).catch(function(error){
    done(error);
  });
};

var localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, ensureUser);

module.exports = localStrategy;
