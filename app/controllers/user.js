'use strict';
var _ = require('lodash'),
    moment = require('moment'),
    User = require('../models/user'),
    Channel = require('../models/channel'),
    request = require('request'),
    mongojs = require('mongojs');
var uuid = require('node-uuid');

module.exports = function (app) {
    app.get('/api/user/terms_accepted', function(req, res){
        res.send(204, null);
    });
    // Get user
    app.get('/api/user/:id', function (req, res) {
        res.json(req.user);
    });

    app.get('/api/user', function (req, res) {
        res.json(req.user);
    });

    app.get('/api/user/:id/api/:id', function (req, res) {
        res.json(_.findWhere(req.user.api, {channelid: req.params.id}));
    });
    app.get('/api/user/api/:id', function (req, res) {
        res.json(_.findWhere(req.user.api, {channelid: req.params.id}));
    });

    var updateUserChannel = function (req, res) {
        var user = req.user,
            key = req.body.key,
            token = req.body.token,
            defaultParams = req.body.defaultParams,
            custom_tokens = req.body.custom_tokens;

        User.overwriteOrAddApiByChannelId(user, req.params.id, {authtype: 'oauth', key : key, token : token, custom_tokens : custom_tokens, defaultParams : defaultParams});
        User.update({_id: user._id}, user).then(function(){
            res.json(user);
        }).catch(function(error){
            console.error(error);
            res.send(422, error);
        });
    };
    app.put('/api/user/:id/channel/:id', updateUserChannel);
    app.put('/api/user/channel/:id', updateUserChannel);

    var getUserActivation = function (req, res) {
        var user = req.user,
            key = req.body.key,
            token = req.body.token,
            custom_tokens = req.body.custom_tokens;
        User.overwriteOrAddApiByChannelId(user, req.params.channelid, {authtype: 'none' });
        User.update({_id: user._id}, user).then(function(){
            res.json(user);
        }).catch(function(error){
            console.error(error);
            res.send(422, error);
        });
    };
    app.put('/api/user/:id/activate/:channelid', getUserActivation);
    app.put('/api/user/activate/:channnelid', getUserActivation);

    var updateChannelByType = function (request, response) {
        var user = request.user, type = request.params.channeltype;
        User.overwriteOrAddApiByChannelType(user, type, {authtype: 'none' });
        User.update({_id: user._id}, user).then(function(){
            response.json(user);
        }).catch(function(error){
            console.error(error);
            response.send(422, error);
        });
    };

    app.put('/api/user/:id/activate/:channeltype/type', updateChannelByType);

    var deleteUserChannel = function (req, res) {
        User.removeApiByChannelId(req.user, req.params.channelid).then(function(){
            res.send(204);
        }, function(){
            res.send(404, {'error': 'not found'});
        });
    };
    app.delete('/api/user/:id/channel/:channelid', deleteUserChannel);
    app.delete('/api/user/channel/:channelid', deleteUserChannel);
};
