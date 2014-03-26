'use strict';

var request = require('request'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    crypto = require('crypto'),
    url = require('url'),
    User = mongoose.model('User');

module.exports = function (app, passport, config) {

    var generateCSRFToken = function() {
        return crypto.randomBytes(18).toString('base64')
        .replace(/\//g, '-').replace(/\+/g, '_');
    }

    var generateRedirectURI = function(req) {
        return url.format({
            protocol: req.protocol,
            host: req.headers.host,
            pathname: app.path() + '/callback'
        });
    }

    var handleOauth1 = function (name, req, res, next) {
        var token = req.param('oauth_token'),
            verifier = req.param('oauth_verifier');

        User.findOne({ $or: [
            {'local.skynetuuid' : req.cookies.skynetuuid},
            {'twitter.skynetuuid' : req.cookies.skynetuuid},
            {'facebook.skynetuuid' : req.cookies.skynetuuid},
            {'google.skynetuuid' : req.cookies.skynetuuid}
        ]}, function(err, user) {
            if(!err) {
                user.addOrUpdateApiByName(name, 'oauth', null, token, null, verifier, null);
                user.save(function (err) {
                    return handleApiCompleteRedirect(res, name, err);
                });
            }
        });
    };

    var saveOAuthInfo = function(name, uuid, key, token, secret, verifier) {
        User.findOne({ $or: [
            {'local.skynetuuid' : uuid},
            {'twitter.skynetuuid' : uuid},
            {'facebook.skynetuuid' : uuid},
            {'google.skynetuuid' : uuid}
        ]
        }, function(err, user) {
            if(!err) {
                user.addOrUpdateApiByName(name, 'oauth', key, token, secret, null, verifier, null);
                user.save(function(err) {
                    return true;
                });
            } else { return false; }
        });
    };

    var getOAuthInstanceFromConfig = function(configSection) {
        var OAuth = require('oauth').OAuth;

        var oa = new OAuth(
            configSection.requestTokenURL,
            configSection.accessTokenURL,
            configSection.consumerKey,
            configSection.consumerSecret,
            configSection.oauthVersion,
            configSection.callbackURL,
            'HMAC-SHA1'
        );

        return oa;
    };

    var getCustomApiOAuthInstance = function(req, api) {
        var OAuth = require('oauth');
        if(api.auth_strategry!='oauth' && !api.oauth) {return null;}

        if(api.oauth.version=='1.0') {
            var oa = new OAuth.OAuth(
                api.oauth.requestTokenURL,
                api.oauth.accessTokenURL,
                api.oauth.key,
                api.oauth.secret,
                api.oauth.version,
                getOAuthCallbackUrl(req, api.name),
                'HMAC-SHA1'
            );

            return oa;
        }

        // should be oauth2 at this point..
        var OAuth2 = require('simple-oauth2')({
            clientID: api.oauth.clientId,
            clientSecret: api.oauth.secret,
            site: api.oauth.baseURL,
            tokenPath: api.oauth.authTokenPath
        });

        return OAuth2;
    };

    var getOAuthCallbackUrl = function(req, apiName) {
        return req.protocol + '://' + req.headers.host + '/api/auth/'+apiName+'/callback/custom';
    };

    var handleApiCompleteRedirect = function(res, name, err) {
        if(!err) {
            return res.redirect('/connector/channels/'+name);
        } else {
            console.log('Error: ' + err);
            return res.redirect('/connector/channels/'+name);
        }
    }

    var handleCustomOAuthRequest = function(req, res, name) {
        var oa = getOAuthInstanceFromConfig(config[name.toLowerCase()]);

        oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
            if (error) {
                console.log(error);
                res.send('yeah no. didn\'t work.')
            }
            else {

                req.session.oauth = {};
                req.session.oauth.token = oauth_token;
                // console.log('oauth.token: ' + req.session.oauth.token);
                req.session.oauth.token_secret = oauth_token_secret;
                // console.log('oauth.token_secret: ' + req.session.oauth.token_secret);

                var authURL = config.etsy.authorizationURL + '?oauth_token='
                    + oauth_token + '&oauth_consumer_key=' + config.etsy.consumerKey
                    + '&callback=' + config.etsy.callbackURL;
                res.redirect(authURL);
            }
        });
    };

    var handleCustomOAuthCallback = function(req, res, name) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var oauth = req.session.oauth;

        var oa = getOAuthInstanceFromConfig(config[name.toLowerCase()]);

        oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
            function(error, oauth_access_token, oauth_access_token_secret, results){
                if (error){
                    console.log(error);
                    // res.send('yeah something broke.');
                    res.redirect(500, '/connector/channels/' + name);
                } else {
                    User.findOne({ $or: [
                        {'local.skynetuuid' : req.cookies.skynetuuid},
                        {'twitter.skynetuuid' : req.cookies.skynetuuid},
                        {'facebook.skynetuuid' : req.cookies.skynetuuid},
                        {'google.skynetuuid' : req.cookies.skynetuuid}
                    ]
                    }, function(err, user) {
                        if(!err) {
                            user.addOrUpdateApiByName(name, 'oauth', null,
                                oauth_access_token, oauth_access_token_secret, null, null);
                            user.save(function(err) {
                                console.log('saved oauth token');
                                return handleApiCompleteRedirect(res, name, err);
                            });
                        } else {
                            console.log('error saving oauth token');
                            res.redirect('/connector/channels/'+name);
                        }
                    });

                }
            }
        );
    };

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback', function(req, res, next) {
        passport.authenticate('facebook', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                // Check if user exists in Skynet
                request.get('http://skynet.im/devices',
                    {qs: {'email': user.facebook.email}}
                    , function (error, response, body) {
                        console.log(body);
                        var data = JSON.parse(body);
                        if(data.error){

                            // Add user to Skynet
                            request.post('http://skynet.im/devices',
                                {form: {'type':'user', 'email': user.facebook.email}}
                                , function (error, response, body) {
                                    if(response.statusCode == 200){

                                        var data = JSON.parse(body);
                                        User.findOne({_id: user._id}, function(err, user) {
                                            if(!err) {
                                                user.facebook.skynetuuid = data.uuid.toString();
                                                user.facebook.skynettoken = data.token.toString();
                                                user.save(function(err) {
                                                    if(!err) {
                                                        console.log('user ' + data.uuid + ' updated');
                                                        res.cookie('skynetuuid', data.uuid, {
                                                            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                                            domain: config.domain,
                                                            httpOnly: false
                                                        });
                                                        res.cookie('skynettoken', data.token, {
                                                            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                                            domain: config.domain,
                                                            httpOnly: false
                                                        });
                                                        return res.redirect('/dashboard');

                                                    }
                                                    else {
                                                        console.log('Error: ' + err);
                                                        return res.redirect('/dashboard');

                                                    }
                                                });
                                            }
                                        });

                                    } else {
                                        console.log('error: '+ response.statusCode);
                                        console.log(error);
                                        return res.redirect('/dashboard');
                                    }
                                }
                            )


                        } else {

                            // res.cookie('skynetuuid', data.devices[0], {
                            //      maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                            //      domain: config.domain,
                            //      httpOnly: false
                            //    });

                            res.cookie('skynetuuid', user.facebook.skynetuuid, {
                                maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                domain: config.domain,
                                httpOnly: false
                            });
                            res.cookie('skynettoken', user.facebook.skynettoken, {
                                maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                domain: config.domain,
                                httpOnly: false
                            });

                            return res.redirect('/dashboard');
                        }
                    });
            });
        })(req, res, next);
    });

    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
    app.get('/auth/twitter/callback', function(req, res, next) {
        passport.authenticate('twitter', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                console.log(user);
                console.log(info);

                // Check if user exists in Skynet
                request.get('http://skynet.im/devices',
                    {qs: {'email': user.twitter.username + '@twitter'}}
                    , function (error, response, body) {
                        console.log(body);
                        var data = JSON.parse(body);
                        if(data.error){

                            // Add user to Skynet
                            request.post('http://skynet.im/devices',
                                {form: {'type':'user', 'email': user.twitter.username + '@twitter'}}
                                , function (error, response, body) {
                                    if(response.statusCode == 200){

                                        var data = JSON.parse(body);
                                        User.findOne({_id: user._id}, function(err, user) {
                                            if(!err) {
                                                user.twitter.skynetuuid = data.uuid.toString();
                                                user.twitter.skynettoken = data.token.toString();
                                                user.save(function(err) {
                                                    if(!err) {
                                                        console.log('user ' + data.uuid + ' updated');
                                                        res.cookie('skynetuuid', data.uuid, {
                                                            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                                            domain: config.domain,
                                                            httpOnly: false
                                                        });
                                                        res.cookie('skynettoken', data.token, {
                                                            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                                            domain: config.domain,
                                                            httpOnly: false
                                                        });
                                                        return res.redirect('/dashboard');

                                                    }
                                                    else {
                                                        console.log('Error: ' + err);
                                                        return res.redirect('/dashboard');
                                                    }
                                                });
                                            }
                                        });

                                    } else {
                                        console.log('error: '+ response.statusCode);
                                        console.log(error);
                                        return res.redirect('/dashboard');
                                    }
                                }
                            )
                        } else {
                            // res.cookie('skynetuuid', data.devices[0], {
                            //   maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                            //   domain: config.domain,
                            //   httpOnly: false
                            // });
                            res.cookie('skynetuuid', user.twitter.skynetuuid, {
                                maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                domain: config.domain,
                                httpOnly: false
                            });
                            res.cookie('skynettoken', user.twitter.skynettoken, {
                                maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                domain: config.domain,
                                httpOnly: false
                            });

                            return res.redirect('/dashboard');
                        }
                    });
            });
        })(req, res, next);
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                console.log(user);
                console.log(info);

                // Check if user exists in Skynet
                request.get('http://skynet.im/devices',
                    {qs: {'email': user.google.email}}
                    , function (error, response, body) {
                        var data = JSON.parse(body);
                        if(data.error){

                            // Add user to Skynet
                            request.post('http://skynet.im/devices',
                                {form: {'type':'user', 'email': user.google.email}}
                                , function (error, response, body) {
                                    if(response.statusCode == 200){

                                        var data = JSON.parse(body);
                                        User.findOne({_id: user._id}, function(err, user) {
                                            if(!err) {
                                                user.google.skynetuuid = data.uuid.toString();
                                                user.google.skynettoken = data.token.toString();
                                                user.save(function(err) {
                                                    if(!err) {
                                                        console.log('user ' + data.uuid + ' updated');
                                                        res.cookie('skynetuuid', data.uuid, {
                                                            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                                            domain: config.domain,
                                                            httpOnly: false
                                                        });
                                                        res.cookie('skynettoken', data.token, {
                                                            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                                            domain: config.domain,
                                                            httpOnly: false
                                                        });
                                                        return res.redirect('/dashboard');

                                                    }
                                                    else {
                                                        console.log('Error: ' + err);
                                                        return res.redirect('/dashboard');
                                                    }
                                                });
                                            }
                                        });

                                    } else {
                                        console.log('error: '+ response.statusCode);
                                        console.log(error);
                                        return res.redirect('/dashboard');
                                    }
                                }
                            )
                        } else {
                            res.cookie('skynetuuid', user.google.skynetuuid, {
                                maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                domain: config.domain,
                                httpOnly: false
                            });
                            res.cookie('skynettoken', user.google.skynettoken, {
                                maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
                                domain: config.domain,
                                httpOnly: false
                            });

                            return res.redirect('/dashboard');
                        }
                    });
            });
        })(req, res, next);
    });

    // use custom OAuth handling with Etsy; re-use for others. I hope.
    app.get('/api/auth/Etsy', function (req, res) {
        handleCustomOAuthRequest(req, res, 'Etsy');
    });
    app.get('/api/auth/Etsy/callback', function (req, res, next) {
        if (req.session.oauth) {
            handleCustomOAuthCallback(req, res, 'Etsy');
        } else
            next(new Error('you\'re not supposed to be here.'))
    });


    // working on custom oauth handling here.....
    app.get('/api/auth/:name/custom', function(req, res) {

        Api.findOne({name: req.params.name}, function (err, api) {

            if(api.oauth.version=='2.0') {
                if(api.name==='Dropbox') {
                    // manually handle oauth...
                    var csrfToken = generateCSRFToken();
                    res.cookie('csrf', csrfToken);
                    res.redirect(url.format({
                        protocol: 'https',
                        hostname: 'www.dropbox.com',
                        pathname: '1/oauth2/authorize',
                        query: {
                            client_id: api.oauth.clientId,
                            response_type: 'code',
                            state: csrfToken,
                            redirect_uri: getOAuthCallbackUrl(req, api.name) // generateRedirectURI(req)
                        }
                    }));

                } else {
                    var OAuth2 = getCustomApiOAuthInstance(req, api);
                    var authorization_uri = OAuth2.AuthCode.authorizeURL({
                        redirect_uri: getOAuthCallbackUrl(req, api.name),
                        scope: 'notifications',
                        state: '3(#0/!~'
                    });
                    res.redirect(authorization_uri);
                }

            } else {
                var oa = getCustomApiOAuthInstance(req, api);
                oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
                    if (error) {
                        console.log(error);
                        res.send('yeah no. didn\'t work.')
                    }
                    else {
                        req.session.oauth = {};
                        req.session.oauth.token = oauth_token;
                        req.session.oauth.token_secret = oauth_token_secret;
                        var callbackURL = getOAuthCallbackUrl(req, api.name);
                        var authURL = api.oauth.authTokenURL + '?oauth_token='
                            + oauth_token + '&oauth_consumer_key=' + api.oauth.key
                            + '&callback=' + callbackURL;
                        res.redirect(authURL);
                    }
                });

            }

        });

    });
    app.get('/api/auth/:name/callback/custom', function(req, res) {
        // handle oauth response....
        var name = req.params.name;

        Api.findOne({name: req.params.name}, function (err, api) {
            if (err) {
                console.log(error);
                res.redirect(500, '/apis/' + api.name);
            } else if(api.oauth.version=='2.0') {
                if(api.name==='Dropbox') {
                    if (req.query.error) {
                        return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
                    }
                    // check CSRF token
                    if (req.query.state !== req.cookies.csrf) {
                        return res.status(401).send('CSRF token mismatch, possible cross-site request forgery attempt.');
                    }
                    // exchange access code for bearer token
                    request.post('https://api.dropbox.com/1/oauth2/token', {
                        form: {
                            code: req.query.code,
                            grant_type: 'authorization_code',
                            redirect_uri: getOAuthCallbackUrl(req, api.name) //generateRedirectURI(req)
                        },
                        auth: {
                            user: api.oauth.clientId,
                            pass: api.oauth.secret
                        }
                        }, function (error, response, body) {
                            var data = JSON.parse(body);

                            if (data.error) {
                                return res.send('ERROR: ' + data.error);
                            }

                            // extract bearer token
                            var token = data.access_token;

                            User.findOne({ $or: [
                                {'local.skynetuuid' : req.cookies.skynetuuid},
                                {'twitter.skynetuuid' : req.cookies.skynetuuid},
                                {'facebook.skynetuuid' : req.cookies.skynetuuid},
                                {'google.skynetuuid' : req.cookies.skynetuuid}
                            ]
                            }, function(err, user) {
                                if(!err) {
                                    user.addOrUpdateApiByName(api.name, 'oauth', null, token, null, null, null);
                                    user.save(function(err) {
                                        console.log('saved oauth token: '+name);
                                        res.redirect('/connector/channels/'+name);
                                    });
                                } else {
                                    console.log('error saving oauth token');
                                    res.redirect('/connector/channels/'+name);
                                }
                            });

                            // use the bearer token to make API calls
                            // request.get('https://api.dropbox.com/1/account/info', {
                            //     headers: { Authorization: 'Bearer ' + token }
                            //     }, function (error, response, body) {
                            //         res.send('Logged in successfully as ' + JSON.parse(body).display_name + '.');
                            // });
                    });
                } else {
                    var OAuth2 = getCustomApiOAuthInstance(req, api);
                    var code = req.query.code;

                    OAuth2.AuthCode.getToken({
                        code: code,
                        redirect_uri: getOAuthCallbackUrl(req, api.name)
                    }, function(error, result) {
                        var token = result;
                        if (error) {
                            console.log('Access Token Error', error);
                            res.redirect('/connector/channels/'+api.name);
                        } else {
                            // token = OAuth2.AccessToken.create(result).token;
                            // console.log('token='+token);
                            // res.redirect('/connector/channels/'+api.name);
                            User.findOne({ $or: [
                                {'local.skynetuuid' : req.cookies.skynetuuid},
                                {'twitter.skynetuuid' : req.cookies.skynetuuid},
                                {'facebook.skynetuuid' : req.cookies.skynetuuid},
                                {'google.skynetuuid' : req.cookies.skynetuuid}
                            ]
                            }, function(err, user) {
                                if(!err) {
                                    user.addOrUpdateApiByName(api.name, 'oauth', null, token, null, null, null);
                                    user.save(function(err) {
                                        console.log('saved oauth token: '+name);
                                        res.redirect('/connector/channels/'+name);
                                    });
                                } else {
                                    console.log('error saving oauth token');
                                    res.redirect('/connector/channels/'+name);
                                }
                            });
                        }
                    });
                }

            } else {
                req.session.oauth.verifier = req.query.oauth_verifier;
                var oauth = req.session.oauth;

                var oa = getCustomApiOAuthInstance(req, api);
                oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
                    function(error, oauth_access_token, oauth_access_token_secret, results){
                        if (error){
                            console.log(error);
                            res.redirect(500, '/apis/' + name);
                        } else {
                            User.findOne({ $or: [
                                {'local.skynetuuid' : req.cookies.skynetuuid},
                                {'twitter.skynetuuid' : req.cookies.skynetuuid},
                                {'facebook.skynetuuid' : req.cookies.skynetuuid},
                                {'google.skynetuuid' : req.cookies.skynetuuid}
                            ]
                            }, function(err, user) {
                                if(!err) {
                                    user.addOrUpdateApiByName(name, 'oauth', null,
                                        oauth_access_token, oauth_access_token_secret, null, null);
                                    user.save(function(err) {
                                        console.log('saved oauth token: ' + name);
                                        return handleApiCompleteRedirect(res, name, err);
                                    });
                                } else {
                                    console.log('error saving oauth token');
                                    res.redirect('/apis/' + name);
                                }
                            });

                        }
                    }
                );
            }
        });

    });

    app.get('/api/auth/LinkedIn',
        passport.authorize('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/LinkedIn/callback',
        function(req, res, next) { handleOauth1('LinkedIn', req, res, next); });

    app.get('/api/auth/Readability',
        passport.authorize('readability', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/Readability/callback',
        function(req, res, next) { handleOauth1('Readability', req, res, next); });

    app.get('/api/auth/StackOverflow',
        passport.authorize('stackexchange', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/StackOverflow/callback',
        function(req, res, next) { handleOauth1('StackOverflow', req, res, next); });

    app.get('/api/auth/Bitly',
        passport.authorize('bitly', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/Bitly/callback',
        function(req, res, next) { handleOauth1('Bitly', req, res, next); });

    app.get('/api/auth/Vimeo',
        passport.authorize('vimeo', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/Vimeo/callback',
        function(req, res, next) { handleOauth1('Vimeo', req, res, next); });

    app.get('/api/auth/FourSquare',
        passport.authorize('foursquare', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/FourSquare/callback',
        function(req, res, next) { handleOauth1('FourSquare', req, res, next); });

    app.get('/api/auth/Tumblr',
        passport.authorize('tumblr', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/Tumblr/callback',
        function(req, res, next) { handleOauth1('Tumblr', req, res, next); });

    app.get('/api/auth/FitBit',
        passport.authorize('fitbit', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/FitBit/callback',
        function(req, res, next) { handleOauth1('FitBit', req, res, next); });

    app.get('/api/auth/Rdio',
        passport.authorize('rdio', { scope: ['r_basicprofile', 'r_emailaddress'] }));
    app.get('/api/auth/Rdio/callback',
        function(req, res, next) { handleOauth1('Rdio', req, res, next); });

    app.get('/api/auth/LastFM', function(req, res) {
        var api_url = config.lastfm.base_url + '?api_key=' + config.lastfm.consumerKey;
        return res.redirect(api_url);
    });
    app.get('/api/auth/LastFM/callback',
        function(req, res, next) {
            // perform custom handling here....
            var token = req.param('token')

            User.findOne({ $or: [
                {'local.skynetuuid' : req.cookies.skynetuuid},
                {'twitter.skynetuuid' : req.cookies.skynetuuid},
                {'facebook.skynetuuid' : req.cookies.skynetuuid},
                {'google.skynetuuid' : req.cookies.skynetuuid}
            ]
            }, function(err, user) {
                if(!err) {
                    user.addOrUpdateApiByName('LastFM', 'token', null, token, null, null, null);
                    user.save(function(err) {
                        return handleApiCompleteRedirect(res, 'LastFM', err);
                    });
                }
            });

        });

    app.get('/api/auth/Delicious', function (req, res) {
        var api_url = config.delicious.base_url + 'auth/authorize?client_id=' + config.delicious.consumerKey;
        api_url += '&redirect_uri=' + config.delicious.callbackURL;
        return res.redirect(api_url);
    });
    app.get('/api/auth/Delicious/callback', function (req, res, next) {
        // perform custom handling here....
        var token = req.param('code');

        User.findOne({ $or: [
            {'local.skynetuuid' : req.cookies.skynetuuid},
            {'twitter.skynetuuid' : req.cookies.skynetuuid},
            {'facebook.skynetuuid' : req.cookies.skynetuuid},
            {'google.skynetuuid' : req.cookies.skynetuuid}
        ]
        }, function(err, user) {
            if(!err) {
                user.addOrUpdateApiByName('Delicious', 'token', null, token, null, null, null);
                user.save(function(err) {
                    return handleApiCompleteRedirect(res, 'Delicious', err);
                });
            }
        });

    });
};
