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
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GithubStrategy = require('passport-github').Strategy;

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
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {

            // asynchronous
            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error
                if (err) {
                    console.log('auth error');
                    return done(null, false, { message : "Internal Server Error"});
                }

                // if no user is found, return the message
                if (!user) {
                    console.log('auth user not found');
                    return done(null, false,  {message : 'No User Found'});
                }

                if (!user.validPassword(password)) {
                    console.log('auth password doesnt match');
                    return done(null, false, {message : 'Invalid Password!'});
                }


                // all is well, return user
                else {
                    console.log('auth good');
                    return done(null, user);
                }

            });

        }));

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
                    if (user) {
                        return user; // user found, return that user
                    } else {
                        // if there is no user, create them
                        return User.create({
                            displayName: profile.name.givenName + ' ' + profile.name.familyName,
                            email: profile.emails[0].value,
                            username: profile.emails[0].value,
                            facebook: {
                                id: profile.id,
                                token: token,
                                username: profile.emails[0].value,
                                displayName: profile.name.givenName + ' ' + profile.name.familyName
                            }
                        });
                    }
                })
                .then(function (user) {
                    done(null, user);
                }, function (err) {
                    done(err);
                });
        }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function (req, token, tokenSecret, profile, done) {
            User.findOne({ 'twitter.id': profile.id }).exec()
                .then(function (user) {
                    if (user) {
                        return user; // user found, return that user
                    } else {
                        // if there is no user, create them
                        return User.create({
                            displayName: profile.displayName,
                            email: profile.displayName + '@twitter',
                            username: profile.username,
                            twitter: {
                                id: profile.id,
                                token: token,
                                username: profile.username,
                                displayName: profile.displayName
                            }
                        });
                    }
                })
                .then(function (user) {
                    done(null, user);
                }, function (err) {
                    done(err);
                });
        }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function (req, token, tokenSecret, profile, done) {
            User.findOne({ 'google.id': profile.id }).exec()
                .then(function (user) {
                    if (user) {
                        return user; // user found, return that user
                    } else {
                        // if there is no user, create them
                        return User.create({
                            username: profile.emails[0].value,
                            displayName: profile.displayName,
                            email: profile.emails[0].value,
                            google: {
                                id: profile.id,
                                token: token,
                                username: profile.emails[0].value,
                                displayName: profile.displayName
                            }
                        });
                    }
                })
                .then(function (user) {
                    done(null, user);
                }, function (err) {
                    done(err);
                });
        }));

    // =========================================================================
    // GITHUB ==================================================================
    // =========================================================================
    passport.use(new GithubStrategy({

            clientID: configAuth.githubAuth.clientID,
            clientSecret: configAuth.githubAuth.clientSecret,
            callbackURL: configAuth.githubAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function (req, token, tokenSecret, profile, done) {
            User.findOne({ 'github.id': profile.id }).exec()
                .then(function (user) {
                    if (user) {
                        return user; // user found, return that user
                    } else {
                        // if there is no user, create them
                        return User.create({
                            username: profile.emails[0].value,
                            displayName: profile.displayName,
                            email: profile.emails[0].value,
                            github: {
                                id: profile.id,
                                token: token,
                                username: profile.emails[0].value,
                                displayName: profile.displayName
                            }
                        });
                    }
                })
                .then(function (user) {
                    done(null, user);
                }, function (err) {
                    done(err);
                });
        }));
};
