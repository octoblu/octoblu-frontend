'use strict';

var request = require('request');

module.exports = function (app, passport, config) {

    // Get device info from Skynet
    app.get('/api/devices/:id', function(req, res) {

        request.get(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.params.id,
        {
            headers: {
                'skynet_auth_uuid': req.params.id,
                'skynet_auth_token': req.query.token
            }}
        , function (error, response, body) {
                console.log("DEVICES", body);
                var data = JSON.parse(body);
                res.json(data);
            });

    });

    // Register device with Skynet
    app.post('/api/devices/:id', function(req, res) {
        // console.log(req);


        var deviceData = {};
        deviceData.owner = req.params.id;
        deviceData.name = req.body.name;

        // flatten array
        var obj = req.body.keyvals;
        for (var i in obj) {
            deviceData[obj[i]["key"]] = obj[i]["value"];
        }
        request.post(req.protocol + '://' + app.locals.skynetUrl + '/devices',
            {form: deviceData}
            , function (error, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });

    });

    // Update device with Skynet
    app.put('/api/devices/:id', function(req, res) {
        // console.log(req);

        var deviceData = {};
        deviceData.owner = req.params.id;
        deviceData.name = req.body.name;
        deviceData.token = req.body.token;

        // flatten array
        var obj = req.body.keyvals;
        for (var i in obj) {
            deviceData[obj[i]["key"]] = obj[i]["value"];
        }

        request.put(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.body.uuid,
            {form: deviceData,
            headers: {
                'skynet_auth_uuid': req.body.uuid,
                'skynet_auth_token': req.body.token
            }}
            , function (error, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });

    });

    // Remove device with Skynet
    app.delete('/api/devices/:id', function(req, res) {

        if( ! req.query.uuid || ! req.query.token) {
            res.send(400, {"error" : "missing required query parameters [uuid, token"});
        }
        request.del(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.params.id,
            {headers: {
                'skynet_auth_uuid': req.query.uuid,
                'skynet_auth_token': req.query.token
            }}
            , function (error, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });

    });

    // Update device with Skynet
    app.put('/api/claimdevice/:uuid', function(req, res) {
        // console.log('skynet_override_token', config.skynet_override_token);
        request.put(req.protocol + '://' + app.locals.skynetUrl + '/claimdevice/' + req.body.uuid + '?overrideIp=' + req.ip,
            {
                form: req.body, 
                headers: {'Skynet_override_token': config.skynet_override_token, 
                'skynet_auth_uuid': req.params.uuid,
                'skynet_auth_token': req.query.token}
                ,
            }, function (error, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });

    });

};
