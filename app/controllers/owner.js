'use strict';

// Get devices by owner
var async = require('async'),
    request = require('request'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('underscore'),
    rest = require('rest'),
    when = require('when'),
    callbacks = require('when/callbacks'),
    nodefn = require('when/node'),
    mime = require('rest/interceptor/mime'),
    entity = require('rest/interceptor/entity'),
    errorCode = require('rest/interceptor/errorCode');

module.exports = function (app, conn) {

    //GET
    //Parameters
    //    id - The owner UUID   [required]
    //    token - The owner token  [required]
    //    type - The device type - 'gateway' or 'device' [required]
    //    includeSubDevices - flag on whether to include subdevices [optional - default is true]
    //Find any unclaimed devices with the given type that are on the owner's network
    //returns JSON array containing the devices
    app.get('/api/owner/:id/:token/devices/:type/unclaimed', function (req, res) {

        if (!req.params.id || !req.params.token || !req.params.type) {
            res.send(400, 'missing or invalid parameters');
        }

        var uuid = req.params.id;
        var token = req.params.token;
        var ip = req.ip;
        User = mongoose.model('User');
        User.findOne(
            { $or: [
                {"local.skynetuuid": uuid, "local.skynettoken": token},
                {"twitter.skynetuuid": uuid, "twitter.skynettoken": token},
                {"facebook.skynetuuid": uuid, "facebook.skynettoken": token},
                {"google.skynetuuid": uuid, "google.skynettoken": token}
            ]
            },
            function (err, userInfo) {
                if (err) {
                    res.send(500, err);
                }
                if (!userInfo) {
                    res.send(401, 'Unauthorized: Invalid UUID or Token');
                } else {

                    request.get('http://skynet.im/devices',
                        {qs: {'ipAddress': req.ip, 'type': 'gateway', 'owner': null }, json: true},
                        function (error, response, body) {
                            if (error) {
                                res.send(404, error);
                            } else {
                                if (body.error) {
                                    res.send(404, error);
                                } else {
                                    var deviceIds = body.devices;
                                    var hubs = [];
                                    async.times(deviceIds.length, function (n, next) {
                                        request.get('http://skynet.im/devices/' + deviceIds[n],{json: true}
                                            , function (error, response, body) {
                                                  var hub = body;
//                                                  hubs.push(body);
                                                  console.log(body);
                                                  next(error, hub);
//                                                var data = JSON.parse(body);
//                                                console.log(data);
//                                                hubs.push(data);
//                                                next(error, hubs);
                                            });
                                    }, function(error, hubs){
                                        if(error){
                                            res.send(404, error);
                                        }
                                        res.send(200, hubs);
                                    });
                                }
                            }
                        }
                    );
                }
            });
    });

    app.get('/api/owner/devices/:id/:token', function (req, res) {
        // request.get('http://skynet.im/devices',
        //  	{qs: {'owner': req.params.id}}
        //  , function (error, response, body) {
        // 		var data = JSON.parse(body);
        //    	res.json(data);
        // });

        request.get('http://skynet.im/mydevices/' + req.params.id,
            { qs: { 'token': req.params.token } },
            function (error, response, body) {
                var data = {};

                try {
                    data = JSON.parse(body);
                } catch (e) {
                }

                res.json(data);
            });
    });


    // Get devices by owner
    app.get('/api/owner/gateways/:id/:token', function(req, res) {
        console.log('Return Devices? ', req.query.devices);
        console.log('ip address ', req.ip)
        request.get('http://skynet.im/mydevices/' + req.params.id,
            {qs: {'token': req.params.token}},
            function (error, response, body) {
                var myDevices = JSON.parse(body);
                myDevices = myDevices.devices;
                console.log('myDevices', myDevices);
                var gateways = []
                for (var i in myDevices) {
                    if(req.query.devices == 'true'){
                        gateways.push(myDevices[i]);
                    } else {
                        if(myDevices[i].type == 'gateway'){
                            gateways.push(myDevices[i]);
                        }

                    }
                }
                console.log('My Devices ', gateways);
                request.get('http://skynet.im/devices',
                    {qs: {'ipAddress': req.ip, 'type':'gateway', 'owner': null }},
                    function (error, response, body) {
                        console.log(body);
                        var ipDevices = JSON.parse(body);
                        var devices = ipDevices.devices;

                        console.log('local gateways',devices);

                        // if(devices) {
                        if (true) {
                            var devicesLength = 0;

                            if (devices){
                                devicesLength = devices.length;
                            }

                            async.times(devicesLength, function(n, next){
                                request.get('http://skynet.im/devices/' + devices[n]
                                    , function (error, response, body) {
                                        var data = JSON.parse(body);
                                        console.log(data);
                                        var dupeFound = false;
                                        console.log('looping', gateways);

                                        for (var i in gateways) {
                                            if(gateways[i].uuid == data.uuid){
                                                dupeFound = true;
                                            }
                                        }
                                        if(!dupeFound){
                                            gateways.push(data);
                                        }
                                        next(error, gateways);
                                    });
                            }, function(err) {
                                console.log(gateways);
                                console.log('==>gateways', gateways);
                                // gateways = gateways[0];
                                // console.log('gateways plugins check');
                                var gatewaysLength = 0;

                                if (gateways){
                                    gatewaysLength = gateways.length;
                                }

                                // Lookup plugins on each gateway
                                async.times(gatewaysLength, function(n, next){
                                    conn.gatewayConfig({
                                        'uuid': gateways[n].uuid,
                                        'token': gateways[n].token,
                                        'method': 'getPlugins'
                                    }, function (plugins) {
                                        console.log('plugins:', plugins.result);
                                        gateways[n].plugins = plugins.result;
                                        next(error, gateways[n]);
                                    });

                                }, function(err, gateways) {
                                    // // Lookup plugins on each gateway
                                    // async.times(gatewaysLength, function(n, next){
                                    //   conn.gatewayConfig({
                                    //     'uuid': gateways[n].uuid,
                                    //     'token': gateways[n].token,
                                    //     'method': 'getPlugins'
                                    //   }, function (plugins) {
                                    //     console.log('plugins:', plugins.result);
                                    //
                                    //     // Get default options for each plugin
                                    //     for (var p in plugins) {
                                    //       conn.gatewayConfig({
                                    //         'uuid': gateways[n].uuid,
                                    //         'token': gateways[n].token,
                                    //         'method': 'getDefaultOptions',
                                    //         'name': p.name
                                    //       }, function (pluginOptions) {
                                    //         console.log('plugin options:', pluginOptions);
                                    //         gateways[n].plugins.options = pluginOptions;
                                    //         next(error, gateways[n]);
                                    //       });
                                    //     }
                                    //
                                    //     gateways[n].plugins = plugins.result;
                                    //     next(error, gateways[n]);
                                    //   });
                                    //
                                    // }, function(err, gateways) {

                                    // console.log('gateways subdevices check');

                                    // Lookup subdevices on each gateway
                                    async.times(gateways.length, function(n, next){
                                        conn.gatewayConfig({
                                            'uuid': gateways[n].uuid,
                                            'token': gateways[n].token,
                                            'method': 'getSubdevices'
                                        }, function (subdevices) {
                                            console.log('==>subdevices:', subdevices.result);
                                            gateways[n].subdevices = subdevices.result;
                                            next(error, gateways[n]);
                                        });

                                    }, function(err, gateways) {
                                        console.log('gateways result', gateways);
                                        res.json({'gateways': gateways});
                                    });
                                });
                            })
                        } else {
                            res.json({'gateways': gateways});
                        }
                    });
            });
    });
};
