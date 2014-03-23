'use strict';

var async = require('async'),
    request = require('request');

// Get devices by owner
module.exports = function (app, conn) {
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
                myDevices = myDevices.devices
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
                        var devices = ipDevices.devices

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