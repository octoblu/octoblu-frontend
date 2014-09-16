var mongoose      = require('mongoose');
var User          = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

var findByEmailAndPassword = function(email, password, done){
  User.findByEmailAndPassword(email, password).then(function(user){
    done(null, user);
  }).catch(function(error){
    done();
  });
};

var localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, findByEmailAndPassword);

module.exports = localStrategy;
