var mongoose      = require('mongoose');
var User          = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

var findOrCreateByEmailAndPassword = function(email, password, done){
  User.findOrCreateByEmailAndPassword(email, password).then(function(user){
    done(null, user);
  }).catch(function(error){
    done(error);
  });
};

var localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, findOrCreateByEmailAndPassword);

module.exports = localStrategy;
