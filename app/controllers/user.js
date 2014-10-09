'use strict';

var _ = require('lodash'),
    moment = require('moment'),
    events = require('../lib/skynetdb').collection('events'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    isAuthenticated = require('./middleware/security').isAuthenticated,
    request = require('request');
var uuid = require('node-uuid');

module.exports = function (app) {
    app.get('/api/user/terms_accepted', function(req, res){
        res.send(204, null);
    });
    // Get user
    app.get('/api/user/:id', isAuthenticated, function (req, res) {
        res.json(req.user);
    });

    app.get('/api/user', isAuthenticated, function (req, res) {
        res.json(req.user);
    });

    app.get('/api/user/:id/api/:id', isAuthenticated, function (req, res) {
        res.json(_.findWhere(req.user.api, {channelid: req.params.id}));
    });
    app.get('/api/user/api/:id', isAuthenticated, function (req, res) {
        res.json(_.findWhere(req.user.api, {channelid: req.params.id}));
    });

    var updateUserChannel = function (req, res) {
        var user = req.user,
            key = req.body.key,
            token = req.body.token,
            custom_tokens = req.body.custom_tokens;

        user.overwriteOrAddApiByChannelId(req.params.id, {authtype: 'oauth', key : key, token : token, custom_tokens : custom_tokens});
        user.save(function (err) {
            if (!err) {
                res.json(user);
            } else {
                console.log('Error: ' + err);
                res.json(user);
            }
        });
    };
    app.put('/api/user/:id/channel/:id', isAuthenticated, updateUserChannel);
    app.put('/api/user/channel/:id', isAuthenticated, updateUserChannel);

    var getUserActivation = function (req, res) {
        var user = req.user,
            key = req.body.key,
            token = req.body.token,
            custom_tokens = req.body.custom_tokens;
        user.overwriteOrAddApiByChannelId(req.params.id, {authtype: 'none' });
        user.save(function (err) {
            if (!err) {
                console.log(user);
                res.json(user);

            } else {
                console.log('Error: ' + err);
                res.json(user);
            }
        });
    };
    app.put('/api/user/:id/activate/:channelid', isAuthenticated, getUserActivation);
    app.put('/api/user/activate/:channnelid', isAuthenticated, getUserActivation);

    var deleteUserChannel = function (req, res) {
        var found = false,
            channelid = req.params.channelid;
        var user = req.user;
        user.api = user.api || [];
        var api = _.findWhere(user.api, {channelid: channelid});
        if (api) {
            user.api = _.without(user.api, api);
            user.save(function (err) {
                if (!err) {
                    res.json({'message': 'success'});

                } else {
                    console.log('Error: ' + err);
                    res.json(404, {'message': 'not found'});
                }
            });
        } else {
            res.send({'message': 'success'});
        }
    };
    app.delete('/api/user/:id/channel/:channelid', isAuthenticated, deleteUserChannel);
    app.delete('/api/user/channel/:channelid', isAuthenticated, deleteUserChannel);
};
