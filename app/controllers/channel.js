'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    NodeType = mongoose.model('NodeType'),
    DeviceType = mongoose.model('DeviceType'),
    User = mongoose.model('User'),
    Channel = require('../models/channel'),
    isAuthenticated = require('./middleware/security').isAuthenticated;
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {
    app.get('/api/channels', function (req, res) {
        Channel.findAllPublic().then(function(channels){
            res.send(channels)
        });
    });

    app.get('/api/customchannels', isAuthenticated, function (req, res) {
        Channel.findAllByOwnerId(req.user.resource.uuid).then(function(channels){
            res.send(channels)
        });
    });

    app.get('/api/channels/active', isAuthenticated, function (req, res) {
        var channelIds = _.pluck(req.user.api, 'channelid');
        Channel.findByIds(channelIds).then(function(channels){
            res.send(channels);
        });
    });

    app.get('/api/channels/:id', function (req, res) {
        Channel.findById(req.params.id).then(function(channel){
            res.send(channel)
        });
    });
};
