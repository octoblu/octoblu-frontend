'use strict';

var _ = require('lodash'),
    moment = require('moment'),
    events = require('../lib/skynetdb').collection('events'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    User = mongoose.model('User'),
    isAuthenticated = require('./middleware/security').isAuthenticated,
    request = require('request');

var uuid = require('node-uuid');

module.exports = function (app) {
    // Get user
    app.get('/api/user/:id', isAuthenticated, function (req, res) {
        res.json(req.user);
    });

    app.get('/api/user', isAuthenticated, function (req, res) {
        res.json(req.user);
    });

    app.get('/api/user/:id/api/:name', isAuthenticated, function (req, res) {
        res.json(_.findWhere(req.user.api, {name: req.params.name}));
    });
    app.get('/api/user/api/:name', isAuthenticated, function (req, res) {
        res.json(_.findWhere(req.user.api, {name: req.params.name}));
    });

    var getUserChannel = function (req, res) {
        var user = req.user,
            key = req.body.key,
            token = req.body.token,
            custom_tokens = req.body.custom_tokens;

        user.addOrUpdateApiByName(req.params.name, 'simple', key, token, null, null, custom_tokens);
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
    app.put('/api/user/:id/channel/:name', isAuthenticated, getUserChannel);
    app.put('/api/user/channel/:name', isAuthenticated, getUserChannel);

    var getUserActivation = function (req, res) {
        var user = req.user,
            key = req.body.key,
            token = req.body.token,
            custom_tokens = req.body.custom_tokens;
        user.addOrUpdateApiByName(req.params.name, 'none', null, null, null, null, null);
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
    app.put('/api/user/:id/activate/:name', isAuthenticated, getUserActivation);
    app.put('/api/user/activate/:name', isAuthenticated, getUserActivation);

    var deleteUserChannel = function (req, res) {
        var found = false,
            name = req.params.name;
        user.api = user.api || [];
        var api = _.findWhere(user.api, {name: name});
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
    app.delete('/api/user/:id/channel/:name', isAuthenticated, deleteUserChannel);
    app.delete('/api/user/channel/:name', isAuthenticated, deleteUserChannel);
};
