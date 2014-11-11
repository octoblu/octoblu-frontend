var User = require('../app/models/user');
var mongojs = require('mongojs');

module.exports = function (env, passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.skynet.uuid);
  });

  passport.deserializeUser(function (uuid, done) {
    User.findOne({'skynet.uuid' : uuid}).then(function (user) {
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
};
