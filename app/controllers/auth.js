'use strict';

var request = require('request'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    crypto = require('crypto'),
    url = require('url'),
    User = mongoose.model('User'),
    isAuthenticated = require('./middleware/security').isAuthenticated;

// Using MongoJS on SkyNet database queries to avoid schemas
var skynetdb = require('../lib/skynetdb').collection('devices');

module.exports = function (app, passport, config) {

    app.post('/api/auth', passport.authenticate('local-login'), loginRoute);
    app.get('/api/auth/login', passport.authenticate('local-login'), loginRoute);

    app.delete('/api/auth', logoutRoute);
    app.get('/api/auth/logout', logoutRoute);

    app.get('/api/auth', isAuthenticated, function (req, res) {
        res.send(req.user);
    });

    function loginRoute(req, res) {
        if (req.user && req.user._id) {
            res.send(req.user)
        } else {
            res.send(401, {error: 'unauthorized'});
        }
    }

    function logoutRoute(req, res) {
        if (req.logout) {
            req.logout();
        }
        res.send(200);
    }

    var getApiHashCode = function (clientSecret, requestCode) {
        var toHash = clientSecret + "|" + requestCode;
        return crypto.createHash("sha256")
            .update(toHash)
            .digest("hex");
    };

    var generateCSRFToken = function () {
        return crypto.randomBytes(18).toString('base64')
            .replace(/\//g, '-').replace(/\+/g, '_');
    };

    var handleOauth1 = function (name, req, res, next) {
        var user = req.user,
            token = req.param('oauth_token'),
            verifier = req.param('oauth_verifier');

        user.addOrUpdateApiByName(name, 'oauth', null, token, null, verifier, null);
        user.save(function (err) {
            return handleApiCompleteRedirect(res, name, err);
        });
    };

    var getOauth1Instance = function (req, api) {
        var OAuth = require('oauth');
        return new OAuth.OAuth(
            api.oauth.requestTokenURL,
            api.oauth.accessTokenURL,
            api.oauth.key,
            api.oauth.secret,
            api.oauth.version,
            getOAuthCallbackUrl(req, api.name),
            'HMAC-SHA1'
        );
    };

    var getOauth2Instance = function (api) {
        return require('simple-oauth2')({
            clientID: api.oauth.clientId,
            clientSecret: api.oauth.secret,
            site: api.oauth.baseURL,
            tokenPath: api.oauth.authTokenPath
        });
    };

    var getOAuthCallbackUrl = function (req, apiName) {
        return req.protocol + '://' + req.headers.host + '/api/auth/' + apiName + '/callback/custom';
    };

    var handleApiCompleteRedirect = function (res, name, err) {
        if (!err) {
            return res.redirect('/connector/channels/' + name);
        } else {
            console.log('Error: ' + err);
            return res.redirect('/connector/channels/' + name);
        }
    };

    var parseHashResponse = function (body) {
        var ar1 = body.split('&');
        var result = {};
        for (var l = 0; l < ar1.length; l++) {
            var pair = ar1[l].split('=');
            result[pair[0]] = pair[1];
        }
        return result;
    };

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { scope: ['profile','email']}), completeLogin);

    app.get('/auth/twitter', passport.authenticate('twitter', { scope: 'email' }));
    app.get('/auth/twitter/callback', passport.authenticate('twitter'), completeLogin);

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google'), completeLogin);

    // working on custom oauth handling here.....
    app.get('/api/auth/:name/custom', function (req, res) {

        Api.findOne({name: req.params.name}, function (err, api) {

            if (api.oauth.version == '2.0') {
                if (api.oauth.isManual) {
                    console.log(api.oauth.protocol, api.oauth.host, api.oauth.authTokenPath)
                    // manually handle oauth...
                    var csrfToken = generateCSRFToken();
                    var timestamp = (new Date()).getTime();
                    var nonce = (new Date()).getTime() * 1000;

                    res.cookie('csrf', csrfToken);
                    var query;
                    if (api.oauth.useOAuthParams) {
                        query = {
                            oauth_consumer_key: api.oauth.clientId,
                            response_type: 'code',
                            oauth_signature: csrfToken,
                            oauth_signature_method: 'HMAC-SHA1',
                            oauth_timestamp: timestamp,
                            oauth_nonce: nonce,
                            oauth_callback: getOAuthCallbackUrl(req, api.name)
                        };
                    } else {
                        query = {
                            client_id: api.oauth.clientId,
                            response_type: 'code',
                            state: csrfToken,
                            redirect_uri: getOAuthCallbackUrl(req, api.name)
                        };
                    }

                    if (api.oauth.scope.length > 0) {
                        query.scope = api.oauth.scope;
                    }

                    var redirectURL = url.format({
                        protocol: api.oauth.protocol,
                        hostname: api.oauth.host,
                        pathname: api.oauth.authTokenPath,
                        query: query
                    });
                    console.log(redirectURL);
                    res.redirect(url.format({
                        protocol: api.oauth.protocol,
                        hostname: api.oauth.host,
                        pathname: api.oauth.authTokenPath,
                        query: query
                    }));

                } else {
                    var oauth2 = getOauth2Instance(api);
                    var authorization_uri = oauth2.AuthCode.authorizeURL({
                        redirect_uri: getOAuthCallbackUrl(req, api.name),
                        scope: api.oauth.scope,
                        state: '3(#0/!~'
                    });
                    console.log(api.oauth);
                    console.log('oauth2 redirect: ' + authorization_uri);
                    res.redirect(authorization_uri);
                }

            } else {
                // oauth 1.0..
                var oa = getOauth1Instance(req, api);
                // var OAuth = require('oauth');
                // var oa = new OAuth.OAuth(
                //     "https://sandbox.evernote.com/oauth",
                //     "https://sandbox.evernote.com/oauth",
                //     "joshcoffman-4144",
                //     "e3d037e41811b07e",
                //     "1.0",
                //     getOAuthCallbackUrl(req, api.name),
                //     'HMAC-SHA1'
                // );
                oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
                    if (error) {
                        console.log(error);
                        res.send('yeah no. didn\'t work.')
                    }
                    else {
                        console.log(error, oauth_token, oauth_token_secret, results);
                        req.session.oauth = {};
                        req.session.oauth.token = oauth_token;
                        req.session.oauth.token_secret = oauth_token_secret;
                        var callbackURL = getOAuthCallbackUrl(req, api.name);
                        // var authURL = 'https://sandbox.evernote.com/OAuth.action' + '?oauth_token='
                        //     + oauth_token + '&oauth_consumer_key=' + api.oauth.key
                        //     + '&callback=' + callbackURL;
                        var authURL = api.oauth.authTokenURL + '?oauth_token='
                            + oauth_token + '&oauth_consumer_key=' + api.oauth.key
                            + '&callback=' + callbackURL;
                        console.log(authURL);
                        res.redirect(authURL);
                    }
                });

            }

        });

    });
    app.get('/api/auth/:name/callback/custom', isAuthenticated, function (req, res) {
        // handle oauth response....
        var name = req.params.name;
        var user = req.user;

        Api.findOne({name: req.params.name}, function (err, api) {
            if (err) {
                console.log(error);
                res.redirect(500, '/apis/' + api.name);
            } else if (api.oauth.version == '2.0') {
                if (api.oauth.isManual) {
                    console.log('handling manual callback');
                    if (req.query.error) {
                        console.log('error position 1');
                        return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
                    }
                    // check CSRF token
                    if (api.oauth.checkCSRFOnCallback && (req.query.state !== req.cookies.csrf || req.query.state.indexOf(req.cookies.csrf) < 0)) {
                        return res.status(401).send('CSRF token mismatch, possible cross-site request forgery attempt.');
                    }

                    var form = {
                        code: req.query.code,
                        grant_type: api.oauth.grant_type,
                        redirect_uri: getOAuthCallbackUrl(req, api.name)
                    };
                    if (api.name === 'Bitly') {
                        delete form.grant_type;
                    }
                    if (api.oauth.accessTokenIncludeClientInfo || api.name === 'Box' || api.name === 'GoogleDrive' || api.name == 'Facebook') {
                        form.client_id = api.oauth.clientId;
                        form.client_secret = api.oauth.secret;
                    }
                    if (api.name === 'Smartsheet') {
                        form.client_id = api.oauth.clientId;
                        form.hash = getApiHashCode(api.oauth.secret, req.query.code);
                    }

                    var auth = {
                        user: api.oauth.clientId,
                        pass: api.oauth.secret
                    };

                    if (api.name === 'Bitly') auth = null;
                    if (api.name === 'Paypal') {
                        delete form.redirect_uri;
                        delete form.code;
                    }

                    // exchange access code for bearer token
                    console.log(api.oauth.accessTokenURL, form);
                    request.post(api.oauth.accessTokenURL, {
                        form: form,
                        auth: auth
                    }, function (error, response, body) {
                        console.log(response.statusCode);
                        var data;

                        if (response.statusCode != '200') {
                            console.log(body);
                            return res.send('ERROR: HTTP Status ' + response.statusCode);

                        } else if (body == 'INVALID_LOGIN') {
                            return res.send('ERROR: ' + body);
                        }

                        if (api.name === 'Facebook' || api.name === 'Bitly') {
                            data = parseHashResponse(body);
                        } else {
                            data = JSON.parse(body);
                        }

                        if (data.error) {
                            console.log('error position 2');
                            return res.send('ERROR: ' + data.error);
                        }

                        // extract bearer token
                        var token = data.access_token;

                        if (token) {
                            user.addOrUpdateApiByName(api.name, 'oauth', null, token, null, null, null);
                            user.save(function (err) {
                                console.log('saved oauth token: ' + name);
                                res.redirect('/connector/channels/' + name);
                            });
                        }
                    });
                } else {
                    var OAuth2 = getOauth2Instance(api);
                    var code = req.query.code;
                    console.log('oauth2 lib getting token...');

                    OAuth2.AuthCode.getToken({
                        code: code,
                        redirect_uri: getOAuthCallbackUrl(req, api.name)
                    }, function (error, result) {
                        var token = result;
                        if (error) {
                            console.log('Access Token Error', error);
                            res.redirect('/connector/channels/' + api.name);
                        } else {
                            user.addOrUpdateApiByName(api.name, 'oauth', null, token, null, null, null);
                            user.save(function (err) {
                                console.log('saved oauth token: ' + name);
                                res.redirect('/connector/channels/' + name);
                            });
                        }
                    });
                }

            } else {
                // oauth 1.0 here
                console.log('oauth 1.0 callback');
                req.session.oauth.verifier = req.query.oauth_verifier;
                var oauth = req.session.oauth;

                var oa = getOauth1Instance(req, api);
                // var OAuth = require('oauth');
                // var oa = new OAuth.OAuth(
                //     "https://sandbox.evernote.com/oauth",
                //     "https://sandbox.evernote.com/oauth",
                //     "joshcoffman-4144",
                //     "e3d037e41811b07e",
                //     "1.0",
                //     getOAuthCallbackUrl(req, api.name),
                //     'HMAC-SHA1'
                // );
                oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
                    function (error, oauth_access_token, oauth_access_token_secret, results) {
                        if (error) {
                            console.log(error);
                            res.redirect(500, '/connector/channels/' + name);
                        } else {
                            user.addOrUpdateApiByName(name, 'oauth', null,
                                oauth_access_token, oauth_access_token_secret, null, null);
                            user.save(function (err) {
                                console.log('saved oauth token: ' + name);
                                return handleApiCompleteRedirect(res, name, err);
                            });
                        }
                    }
                );
            }
        });

    });

    function completeLogin (req, res) {
        var user = req.user;
        res.cookie('skynetuuid', user.skynet.uuid, {
            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
            domain: config.domain,
            httpOnly: false
        });
        res.cookie('skynettoken', user.skynet.token, {
            maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
            domain: config.domain,
            httpOnly: false
        });

        // Check for deep link redirect based on referrer in querystring
        if (req.session.redirect) {
            if (req.session.js) {
                return res.send('<script>window.location.href="' + req.session.redirect + '?uuid=' + user.google.skynetuuid + '&token=' + user.google.skynettoken + '"</script>');
            } else {
                return res.redirect(req.session.redirect + '?uuid=' + user.google.skynetuuid + '&token=' + user.google.skynettoken);
            }
        } else {
            return res.redirect('/dashboard');
        }
    }

};
