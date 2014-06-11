'use strict';

var _ = require('underscore'),
    request = require('request'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    Device = mongoose.model('Device'),
    User = mongoose.model('User');

module.exports = function (app) {

    // List of all API channels
    app.get('/api/channels', function(req, res) {
        Api.find({owner: {$exists: false}, enabled: true}, function (err, apis) {
            if (err) { res.send(err); } else { res.json(apis); }
        });
    });

    // authorization check:
//    app.get('/api/*', function(req,res,next) {
//
//        if(req.cookies.skynetuuid && req.cookies.skynettoken) {
//            next();
//            return;
//        }
//        // console.log('headers', req.headers);
//        // console.log('query', req.query);
//        // console.log(req.params.id);
//        console.log('access denied');
//        return res.json(403, { 'message': 'not authorized' });
//        next();
//    });


    // List of all Smart Devices
    // TODO: rename to match naming convention
    app.get('/api/smartdevices', function(req, res) {
        Device.find({}, function (err, apis) {
            if (err) { res.send(err); } else { res.json(apis); }
        });
    });

    // List of active API channels
    app.get('/api/channels/:uuid/active', function(req, res) {
        var uuid = req.params.uuid;

        User.findOne({ $or: [
            {'local.skynetuuid' : uuid},
            {'twitter.skynetuuid' : uuid},
            {'facebook.skynetuuid' : uuid},
            {'google.skynetuuid' : uuid}
        ]}, function(err, user) {
            if(err) { return res.json(err); }
            if(!user || !user.api) { return res.json(404, { 'result': 'not found' }); }

            var criteria = _.pluck(user.api, 'name');

            Api.find(
                { name: { $in: criteria }, enabled: true },
                { application: 0, custom_tokens: 0 },
                function(err, apis) {
                    if(err) { return res.json(err); }
                    console.log('==apis', apis);
                    res.json(apis);
                }
            );
        });
    });

    // List of active API channels
    app.get('/api/channels/:uuid/available', function(req, res) {
        var uuid = req.params.uuid;

        User.findOne({ $or: [
            {'local.skynetuuid' : uuid},
            {'twitter.skynetuuid' : uuid},
            {'facebook.skynetuuid' : uuid},
            {'google.skynetuuid' : uuid}
        ]}, function (err, user) {
            if (err) { return res.json(err); }
            if (!user || !user.api) { return res.json(404, { 'result': 'not found' }); }

            var criteria = _.pluck(user.api, 'name');

            Api.find(
                { name: { $nin: criteria }, owner: { $exists: false }, enabled: true },
                { application: 0, custom_tokens: 0 },
                function(err, apis) {
                    if(err) { return res.json(err); }
                    res.json(apis);
                }
            );
        });
    });

    // TODO: Rename to match naming convention
    app.get('/api/customchannels/:uuid', function(req, res) {
        Api.find({owner: req.params.uuid, enabled: true}, function (err, apis) {
            if (err) { res.send(err); } else { res.json(apis); }
        });
    });

    app.put('/api/channels', function(req, res) {
        console.log('returning channel list');

        var channel = req.body;
        // console.log(channel);
        // res.json({'message':'TODO'});
        if(channel['_id']) {
            var id = channel['_id'];
            var query = {_id: id};
            delete channel['_id'];
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

    app.get('/api/channels/:name', function(req, res) {
        Api.findOne({ name: req.params.name }, function (err, api) {
            if (err) { res.send(err); } else { res.json(api); }
        });
    });
};
