// load all the things we need
var rest = require('rest'),
    when = require('when'),
    _ = require('lodash'),
    nodefn = require('when/node/function'),
    mime = require('rest/interceptor/mime'),

    errorCode = require('rest/interceptor/errorCode'),
    client = rest.wrap(mime).wrap(errorCode),
    crypto = require('crypto'),
    config = require('./auth');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (env, passport) {

// load the auth variables
    var configAuth = require('./auth')(env); // use this one for testing

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            // asynchronous
            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // create the user
                    var newUser = new User({
                        email: email,
                        displayName: email,
                        username: email,
                        local: {
                            email: email,
                            displayName: email,
                            username: email
                        }

                    });
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function (err, dbUser) {
                        if (err)
                            throw err;

                        return done(null, dbUser);
                    });
                }

            });
        }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, token, refreshToken, profile, done) {
            User.findOne({ 'facebook.id': profile.id }).exec()
                .then(function (user) {
//                    if (user) {
                        return user; // user found, return that user
//                    } else {
//                        if there is no user, create them
//                        return User.create({
//                            displayName: profile.name.givenName + ' ' + profile.name.familyName,
//                            email: profile.emails[0].value,
//                            username: profile.emails[0].value,
//                            facebook: {
//                                id: profile.id,
//                                token: token,
//                                username: profile.emails[0].value,
//                                displayName: profile.name.givenName + ' ' + profile.name.familyName
//                            }
//                        });
//                    }
                })
                .then(function (user) {
                    done(null, user);
                }, function (err) {
                    done(err);
                });
        }));
};
