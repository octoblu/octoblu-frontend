var User          = require('../app/models/user');
var LocalStrategy = require('passport-local').Strategy;

var findByEmailAndPassword = function(email, password, done){
  User.findByEmailAndPassword(email, password).then(function(user){
    done(null, user);
  }).catch(function(error){
    done(error);
  });
};

var localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, findByEmailAndPassword);

module.exports = localStrategy;
