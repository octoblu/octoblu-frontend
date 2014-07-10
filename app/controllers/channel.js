'use strict';

var _ = require('underscore'),
    request = require('request'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    DeviceType = mongoose.model('DeviceType'),
    User = mongoose.model('User'),
    isAuthenticated = require('./middleware/security').isAuthenticated;

module.exports = function (app) {

    // List of all API channels
    app.get('/api/channels', function (req, res) {
        Api.find({owner: {$exists: false}, enabled: true}, function (err, apis) {
            if (err) {
                res.send(err);
            } else {
                res.json(apis);
            }
        });
    });

    // List of all Smart Devices
    // TODO: rename to match naming convention
    app.get('/api/devicetypes', function (req, res) {
        DeviceType.find({}, function (err, apis) {
            if (err) {
                res.send(err);
            } else {
                res.json(apis);
            }
        });
    });

    // List of active API channels
    app.get('/api/channels/active', isAuthenticated, function (req, res) {
        var user = req.user,
            criteria = _.pluck(user.api, 'name');

        Api.find(
            { name: { $in: criteria }, enabled: true },
            { application: 0, custom_tokens: 0 },
            function (err, apis) {
                if (err) {
                    return res.json(err);
                }
                console.log('==apis', apis);
                res.json(apis);
            }
        );
    });

    // List of active API channels
    app.get('/api/channels/available', isAuthenticated, function (req, res) {
        var user = req.user,
            criteria = _.pluck(user.api, 'name');

        Api.find(
            { name: { $nin: criteria }, owner: { $exists: false }, enabled: true },
            { application: 0, custom_tokens: 0 },
            function (err, apis) {
                if (err) {
                    return res.json(err);
                }
                res.json(apis);
            }
        );
    });

    // TODO: Rename to match naming convention
    app.get('/api/customchannels', isAuthenticated, function (req, res) {
        Api.find({owner: req.user.resource.uuid, enabled: true}, function (err, apis) {
            if (err) {
                res.send(err);
            } else {
                res.json(apis);
            }
        });
    });

    app.put('/api/channels', function (req, res) {
        var channel = req.body;
        if (channel._id) {
            var id = channel._id;
            var query = {_id: id};
            delete channel._id;
            console.log(channel);

            Api.update(query, channel, {upsert: true}, function (err) {
                if (err) {
                    console.log('error saving api');
                    console.log(err);
                    res.send(err);
                } else {
                    channel['_id'] = id;
                    res.json(channel);
                }
            });

        } else {
            var n = new Api(channel);
            n.save(function (err, n) {
                if (err) {
                    console.log('error saving api');
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(n);
                }
            });
        }
    });

    app.get('/api/channels/:name', function (req, res) {
        Api.findOne({ name: req.params.name }, function (err, api) {
            if (err) {
                res.send(err);
            } else {
                res.json(api);
            }
        });
    });

    app.delete('/api/channels/:name', isAuthenticated, function(req, res) {
        // model.findOneAndRemove
        // owner: req.user.resource.uuid
        Api.findOneAndRemove({ name: req.params.name, owner: req.user.resource.uuid }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({'msg':'ok'});
            }
        });
    });
};
