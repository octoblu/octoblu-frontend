'use strict';

// Get devices by owner
var async = require('async'),
    request = require('request'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    rest = require('rest'),
    when = require('when'),
    mime = require('rest/interceptor/mime'),
    errorCode = require('rest/interceptor/errorCode'),
    nodefn = require('when/node'),
    sequence = require('when/sequence'),
    callbacks = require('when/callbacks'),
    client = rest.wrap(mime).wrap(errorCode);

module.exports = function (app, config, conn) {

    //TODO - clean up APIs
    app.get('/api/owner/:id/:token/gateways', function(req, res){

        var ownedDevices;

        client({
            method : 'GET',
            path : req.protocol + "://" + app.locals.skynetUrl + "/mydevices",
            headers : {
                "skynet_auth_uuid" : req.params.id,
                "skynet_auth_token" : req.params.token
            }
        })
        .then(function(result){

            var devices = _.filter(result.entity.devices, { type : "gateway"}) || [];
            return devices;
        })
        .then(function(devices){
            ownedDevices = devices;

            var getConfigDetailsForDevice = function(device, next){
                conn.gatewayConfig({
                    'uuid': device.uuid,
                    'token': device.token,
                    'method': 'configurationDetails'
                }, function (data) {
                     console.log(JSON.stringify(data));
                     device.subdevices = data.result.subdevices || [];
                     device.plugins = data.result.plugins || [];
                     next(null, device);
                });
            };


            async.mapSeries(ownedDevices, getConfigDetailsForDevice, function(error, devices ){
                console.log(JSON.stringify(devices));
                res.send(devices);
            });
        })
        .catch(function(errorResult){
            res.send(errorResult.status.code, errorResult.status.text);
        });



    });

    app.get('/api/owner/:id/:token/devices', function(req, res){
        if (!req.params.id || !req.params.token ) {
            res.send(400, 'missing or invalid parameters');
        }

        User.findBySkynetUUIDAndToken(req.params.id, req.params.token)
            .then(function(user){
                if(! user ){
                   var error = {"error" : "Unauthorized. User not found"};
                   throw error;
                }

                client({
                    method : 'GET',
                    path : req.protocol + "://" + app.locals.skynetUrl + "/mydevices",
                    params : {
                        "ipAddress" : req.ip
                    },
                    headers : {
                        "skynet_auth_uuid" : req.params.id,
                        "skynet_auth_token" : req.params.token
                    }
                }).then(function(result){
                    var devices = result.entity.devices || [];
                    res.send(devices);
                }, function(errorResult){
                    res.send(errorResult.status.code, errorResult.status.text);
                });


        }, function(error){
               res.send(500, error);
        });
    });
    //GET
    //Parameters
    //    id - The owner UUID   [required]
    //    token - The owner token  [required]
    //    type - The device type - 'gateway' or 'device' [required]
    //    includeSubDevices - flag on whether to include subdevices [optional - default is true]
    //Find any unclaimed devices with the given type that are on the owner's network
    //returns JSON array containing the devices
    app.get('/api/owner/:id/:token/devices/unclaimed', function (req, res) {

        if (!req.params.id || !req.params.token ) {
            res.send(400, 'missing or invalid parameters');
        }
        User.findBySkynetUUIDAndToken(req.params.id, req.params.token)
            .then(function(user){
                if( ! user ){
                    var error = {"error" : "Unauthorized", "status_code" : 401};
                    throw error;
                }

                client({
                    method : 'GET',
                    path : req.protocol + "://" + app.locals.skynetUrl + "/devices",
                    params : {
                        "ipAddress" : req.ip,
                        "type" : "gateway",
                        "owner" : null
                    },
                    headers : {
                        "skynet_auth_uuid" : req.params.id,
                        "skynet_auth_token" : req.params.token,
                        "skynet_override_token" : config.skynet_override_token
                    }
                }).then(function(result){
                    return res.send(result.entity);
            }, function(errorResult){
                return res.send(errorResult.status.code, errorResult.status.text);
            });

        }, function(error){
            return res.send(error.status_code, error);
        });
    });

    // Get devices by owner
    app.get('/api/owner/gateways/:id/:token', function(req, res) {
        console.log('Return Devices? ', req.query.devices);
        console.log('ip address ', req.ip) ;
        request.get(req.protocol + '://' + app.locals.skynetUrl + '/mydevices',
            {  headers: {
                'skynet_auth_uuid': req.params.id,
                'skynet_auth_token': req.params.token
            }
        }, function (error, response, body) {
                var myDevices = JSON.parse(body);
                myDevices = myDevices.devices;
                // console.log('myDevices', myDevices);
                var gateways = []  ;
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
                request.get(req.protocol + '://' + app.locals.skynetUrl + '/devices',
                    {qs: {'ipAddress': req.ip, 'type':'gateway', 'owner': null },
                    headers: {
                        'skynet_auth_uuid': req.params.id,
                        'skynet_auth_token': req.params.token
                    }},
                    function (error, response, body) {
                        console.log(body);
                        var ipDevices = JSON.parse(body);
                        var devices = ipDevices.devices;

                        console.log('local gateways',devices);

                        // if(devices) {
                        if (true) {
                            var devicesLength = 0;

                            if (devices){
                                // devicesLength = devices.length;
                                for (var i = 0; i < devices.length; i++) {
                                    gateways.push(devices[i]);
                                }
                            }

                            // async.times(devicesLength, function(n, next){
                            //     request.get(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + devices[n]
                            //         , function (error, response, body) {
                            //             var data = JSON.parse(body);
                            //             console.log(data);
                            //             var dupeFound = false;
                            //             console.log('looping', gateways);

                            //             for (var i in gateways) {
                            //                 if(gateways[i].uuid == data.uuid){
                            //                     dupeFound = true;
                            //                 }
                            //             }
                            //             if(!dupeFound){
                            //                 gateways.push(data);
                            //             }
                            //             next(error, gateways);
                            //         });
                            // }, function(err) {
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
                                    console.log(gateways[n].uuid);
                                    console.log(gateways[n].token);
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
                            // })
                        } else {
                            res.json({'gateways': gateways});
                        }
                    });
            });
    });
};
