'use strict';

var request = require('request'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    crypto = require('crypto'),
    url = require('url'),
    User = mongoose.model('User'),
    isAuthenticated = require('./middleware/security').isAuthenticated;
var ObjectId = require('mongoose').Types.ObjectId;

// Using MongoJS on SkyNet database queries to avoid schemas
var skynetdb = require('../lib/skynetdb').collection('devices');

module.exports = function (app, passport, config) {

    app.post('/api/auth', passport.authenticate('local-login'), loginRoute);
    app.get('/api/auth/login', passport.authenticate('local-login'), loginRoute);

    app.delete('/api/auth', logoutRoute);
    app.get('/api/auth/logout', logoutRoute);
    app.put('/api/auth/accept_terms', isAuthenticated, updateTerms);
    app.put('/api/auth/password', isAuthenticated, updatePassword);

    app.get('/api/auth', isAuthenticated, function (req, res) {
        res.send(req.user);
    });

    app.get('/auth/logout', logoutAndRedirectRoute);

    function loginRoute(req, res) {
        var user = req.user;

        if (! user || ! user._id) {
            res.send(401, {error: 'unauthorized'});
            return;
        }
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
        res.send(user);
    }

    function logoutRoute(req, res) {
        res.clearCookie('skynetuuid');
        res.clearCookie('skynettoken');

        if (req.logout) {
            req.logout();
        }
        res.send(204);
    }

    function logoutAndRedirectRoute(req, res) {
        res.clearCookie('skynetuuid');
        res.clearCookie('skynettoken');

        if (req.logout) {
            req.logout();
        }

        res.redirect('/');
    }

    function updatePassword (req, res) {
        var oldPassword, newPassword;

        oldPassword = req.body.oldPassword;
        newPassword = req.body.newPassword;

        req.user.updatePassword(oldPassword, newPassword).then(function(){
            return res.send(204);
        })
        .catch(function(){
            return res.send(422, {errors: {oldPassword: ['is incorrect.']}});
        });
    }

    function updateTerms (req, res) {
        req.user.acceptTerms(req.body.accept_terms).then(function(){
            return res.send(204);
        })
        .catch(function(){
            return res.send(422, {errors: {accept_terms: ['must be true']}});
        })
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

    var handleOauth1 = function (channelid, req, res, next) {
        var user = req.user,
            token = req.param('oauth_token'),
            verifier = req.param('oauth_verifier');

        user.addOrUpdateApiByChannelId(channelid, 'oauth', null, token, null, verifier, null);
        user.save(function (err) {
            return handleApiCompleteRedirect(res, channelid, err);
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
            getOAuthCallbackUrl(req, api._id),
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

    var getOAuthCallbackUrl = function (req, channelid) {
        return (req.headers.host.indexOf('octoblu.com')>=0) ? 'https://'+ req.headers.host + '/api/auth/' + channelid + '/callback/custom' 
          : req.protocol + '://' + req.headers.host + '/api/auth/' + channelid + '/callback/custom';
        // return req.protocol + '://' + req.headers.host + '/api/auth/' + channelid + '/callback/custom';
    };

    var handleApiCompleteRedirect = function (res, channelid, err) {
        if (!err) {
            return res.redirect('/connect/nodes/channel/' + channelid);
        } else {
            console.log('Error: ' + err);
            return res.redirect('/node-wizard/node-wizard/add-channel/'+channelid+'/oauth');
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

    app.get('/auth/facebook', storeReferrer, passport.authenticate('facebook', { scope: 'email' }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { scope: ['profile', 'email']}), restoreReferrer, completeLogin);

    app.get('/auth/twitter', storeReferrer, passport.authenticate('twitter', { scope: 'email' }));
    app.get('/auth/twitter/callback', passport.authenticate('twitter'), restoreReferrer, completeLogin);

    app.get('/auth/google', storeReferrer, passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google'), restoreReferrer, completeLogin);

    app.get('/auth/github', storeReferrer, passport.authenticate('github', { scope: ['user:email'] }));
    app.get('/auth/github/callback', passport.authenticate('github'), restoreReferrer, completeLogin);

    // working on custom oauth handling here.....
    app.get('/api/auth/:id/custom', function (req, res) {

        Api.findOne({_id: new ObjectId(req.params.id)}, function (err, api) {
            if (api.oauth.version === '2.0') {
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
                            oauth_callback: getOAuthCallbackUrl(req, api._id)
                        };
                    } else {
                        query = {
                            client_id: api.oauth.clientId,
                            response_type: 'code',
                            state: csrfToken,
                            redirect_uri: getOAuthCallbackUrl(req, api._id)
                        };
                    }

                    if(api.oauth.auth_use_client_id_value) {
                        query.client_id = api.oauth.auth_use_client_id_value;
                    }
                    if(api.oauth.auth_use_api_key==true && api.oauth.clientId) {
                        query.api_key = api.oauth.clientId;
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
                        redirect_uri: getOAuthCallbackUrl(req, api._id),
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
                        var callbackURL = getOAuthCallbackUrl(req, api._id);

                        var authURL = api.oauth.authTokenURL + '?oauth_token='
                            + oauth_token;

                        if (api.name != 'Tumblr') {
                            authURL += '&oauth_consumer_key=' + api.oauth.key
                                + '&callback=' + callbackURL;
                        }
                        console.log(authURL);
                        res.redirect(authURL);
                    }
                });

            }

        });

    });
    app.get('/api/auth/:id/callback/custom', isAuthenticated, function (req, res) {
        // handle oauth response....
        var channelid = req.params.id;
        var user = req.user;

        Api.findOne({_id: new ObjectId(req.params.id)}, function (err, api) {
            if (err) {
                console.log(error);
                res.redirect(500, '/apis/' + api._id);
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
                        redirect_uri: getOAuthCallbackUrl(req, api._id)
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

                    var query = {};
                    if(api.oauth.auth_use_client_id_value) {
                        form.client_id = api.oauth.auth_use_client_id_value;
                    }
                    if(api.oauth.auth_use_api_key==true && api.oauth.clientId) {
                        query.api_key = api.oauth.clientId;
                    }

                    if (api.name === 'Bitly') auth = null;
                    if (api.name === 'Paypal') {
                        delete form.redirect_uri;
                        delete form.code;
                    }

                    // exchange access code for bearer token
                    var opts = {
                        form: form,
                        auth: auth,
                        qs: query
                    };
                    console.log(api.oauth.accessTokenURL, opts);
                    request.post(api.oauth.accessTokenURL, opts, function (error, response, body) {
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
                            user.overwriteOrAddApiByChannelId(api._id, {authtype: 'oauth', token: token});
                            user.save(function (err) {
                                console.log('saved oauth token: ' + token);
                                res.redirect('/connect/nodes/channel/' + channelid);
                            });
                        }
                    });
                } else {
                    var OAuth2 = getOauth2Instance(api);
                    var code = req.query.code;
                    console.log('oauth2 lib getting token...');

                    OAuth2.AuthCode.getToken({
                        code: code,
                        redirect_uri: getOAuthCallbackUrl(req, api._id)
                    }, function (error, result) {
                        var token = result;

                        token = token.access_token || token;

                        if (error) {
                            console.log('Access Token Error', error);
                            res.redirect('/node-wizard/node-wizard/add-channel/'+api._id+'/oauth');
                        } else {
                            user.overwriteOrAddApiByChannelId(api._id, {authtype: 'oauth', token: token});
                            user.save(function (err) {
                                console.log('saved oauth token: ' + token);
                                res.redirect('/connect/nodes/channel/' + channelid);
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
                oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
                    function (error, oauth_access_token, oauth_access_token_secret, results) {
                        if (error) {
                            console.log(error);
                            res.redirect(500, '/node-wizard/node-wizard/add-channel/'+channelid+'/oauth');
                        } else {
                            user.addOrUpdateApiByChannelId(channelid, 'oauth', null,
                                oauth_access_token, oauth_access_token_secret, null, null);
                            user.save(function (err) {
                                console.log('saved oauth token: ' + channelid);
                                return handleApiCompleteRedirect(res, channelid, err);
                            });
                        }
                    }
                );
            }
        });

    });

    //Keep the referrer in the session as briefly as possible - this prevents the login infinite redirect error.
    function storeReferrer(req, res, next) {
        req.session.referrer = req.query.referrer;
        req.session.mobile = req.query.mobile;
        delete req.query.referrer;
        delete req.query.mobile;
        next();
    }

    function restoreReferrer(req, res, next) {
        req.referrer = req.session.referrer;
        req.mobile = req.session.mobiler;
        delete req.session.referrer;
        delete req.session.mobile;
        next();
    }

    function completeLogin(req, res) {
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

        if (req.referrer) {
            if (req.session.js || req.mobile) {
                res.send('<script>window.location.href="' + req.referrer + '?uuid=' + encodeURIComponent(user.skynet.uuid) + '&token=' + encodeURIComponent(user.skynet.token) + '"</script>');
            } else {
                res.redirect(req.referrer + '?uuid=' + encodeURIComponent(user.skynet.uuid) + '&token=' + encodeURIComponent(user.skynet.token));
            }
        } else {
            res.redirect('/home');
        }
    }
};
