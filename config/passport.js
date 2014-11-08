var User = require('../app/models/user');
var mongojs = require('mongojs');

module.exports = function (env, passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.find({_id : mongojs.ObjectId(id)}).then(function (user) {
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
};
