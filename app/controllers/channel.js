'use strict';

var _ = require('lodash'),
    request = require('request'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    NodeType = mongoose.model('NodeType'),
    DeviceType = mongoose.model('DeviceType'),
    User = mongoose.model('User'),
    isAuthenticated = require('./middleware/security').isAuthenticated;
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {

    // List of all API channels
    app.get('/api/channels', function (req, res) {
        Api.find({owner: {$exists: false}, enabled: true}, function (err, apis) {
            if (err) {
                res.send(500, err);
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
                res.send(500, err);
            } else {
                res.json(apis);
            }
        });
    });

    // List of active API channels
    app.get('/api/channels/active', isAuthenticated, function (req, res) {
        var user = req.user,
            criteria = _.compact(_.pluck(user.api, 'channelid'));
            console.log(criteria);

        Api.find(
            { _id: { $in: criteria }, enabled: true },
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
            criteria = _.pluck(user.api, 'channelid');
        var criteria = criteria.filter(function(item) {
                return item;
            });

        Api.find(
            { _id: { $nin: criteria }, owner: { $exists: false }, enabled: true },
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

    var addUpdateNodeTypeFromChannel = function(channelId, callback) {
        Api.findOne({_id: new ObjectId(channelId)}, function (err, channel) {
            if(err) {
                callback(err);
            } else {
                var nodeType = {
                  name: channel.name,
                  logo: channel.logo,
                  description: channel.description,
                  skynet: { subtype: channel.name, type: "channel" },
                  category: "channel", enabled: true, display: true //,
                  // channel: channel
                };
                console.log('about to upsert NodeType: ', nodeType);
                // NodeType.update(
                //     {name: channel.name, "channel._id": channelId},
                //     nodeType,
                //     {upsert: true},
                //     function (er) {
                //         if(er) console.log(er);
                //         callback(er);
                //     });
                callback();
            }
        });
        // callback();
    };

    app.put('/api/channels', function (req, res) {
        var channel = req.body;
        if (channel._id) {
            var id = channel._id;
            var query = {_id: id};
            // delete channel._id;
            Api.update(query, channel, {upsert: true}, function (err, doc) {
                if (err) {
                    console.log('error saving api');
                    console.log(err);
                    res.send(err);
                } else {
                    channel['_id'] = id;
                    addUpdateNodeTypeFromChannel(id, function(er) {
                        res.json(channel);
                    });
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
                    addUpdateNodeTypeFromChannel(n._id, function(er) {
                        res.json(n);
                    });
                }
            });
        }
    });

    app.get('/api/channels/:id', function (req, res) {
        Api.findOne({ _id: new ObjectId(req.params.id) }, function (err, api) {
            if (err) {
                res.send(err);
            } else {
                res.json(api);
            }
        });
    });

    app.delete('/api/channels/:id', isAuthenticated, function(req, res) {
        // model.findOneAndRemove
        // owner: req.user.resource.uuid
        Api.findOneAndRemove({ _id: new ObjectId(req.params.id), owner: req.user.resource.uuid }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({'msg':'ok'});
            }
        });
    });
};
