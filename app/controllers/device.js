'use strict';

var request = require('request');

module.exports = function (app) {

    // Get device info from Skynet
    app.get('/api/devices/:id', function(req, res) {

        request.get(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.params.id
            , function (error, response, body) {
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

        request.post(req.protocol + '://' + app.locals.skynetUrl + '/devices' ,
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
            {form: deviceData}
            , function (error, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });

    });

    // Remove device with Skynet
    app.del('/api/devices/:id/:token', function(req, res) {

        request.del(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.params.id,
            {form: {"token": req.params.token}}
            , function (error, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });

    });
};
