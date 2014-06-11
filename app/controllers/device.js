'use strict';
var _ = require('lodash'),
    rest = require('rest'),
    when = require('when'),
    mime = require('rest/interceptor/mime'),
    errorCode = require('rest/interceptor/errorCode'),
    callbacks = require('when/callbacks'),
    Resource = require('../models/mixins/resource'),
    client = rest.wrap(mime).wrap(errorCode),
    request = require('request'),
    isAuthenticated = require('./controller-middleware').isAuthenticated;
    var deviceController = {
    getDeviceByUUID : function(req, res){
        client({
            method: 'GET',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/:uuid",
            params : {
                uuid : req.params.uuid
            },
            headers: {
                 skynet_auth_uuid : req.headers.skynet_auth_uuid,
                 skynet_auth_token : req.headers.skynet_auth_token
            }
        })
        .then(function(result){
           var device =  Resource.makeResourceObject({
                   model: _.findWhere( result.entity.devices, { uuid : req.params.uuid}),
                   type: 'device',
                   uuidProperty: 'uuid',
                   ownerType: owner.resource.type,
                   includeProperties: ['uuid', 'token', 'name', 'type', 'online', 'ipAddress' ]
               });
            res.send(device);
        })
        .catch(function(error){
            res.send(400, error);
        });
    },

    registerDevice : function(req, res){
        client({
            method: 'GET',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/:uuid",
            params : {
                uuid : req.params.uuid
            },
            headers: {
                skynet_auth_uuid : req.headers.skynet_auth_uuid,
                skynet_auth_token : req.headers.skynet_auth_token
            }
        })
            .then(function(result){
                var device =  Resource.makeResourceObject({
                    model: _.findWhere( result.entity.devices, { uuid : req.params.uuid}),
                    type: 'device',
                    uuidProperty: 'uuid',
                    ownerType: owner.resource.type,
                    includeProperties: ['uuid', 'token', 'name', 'type', 'online', 'ipAddress' ]
                });
                res.send(device);
            })
            .catch(function(error){
                res.send(400, error);
            });

    },

    deleteDevice : function(req, res){
        client({
            method: 'DELETE',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/:uuid",
            params : {
                uuid : req.params.uuid
            },
            headers: {
                skynet_auth_uuid : req.headers.skynet_auth_uuid,
                skynet_auth_token : req.headers.skynet_auth_token
            }
        })
            .then(function(result){
                var device =  Resource.makeResourceObject({
                    model: _.findWhere( result.entity.devices, { uuid : req.params.uuid}),
                    type: 'device',
                    uuidProperty: 'uuid',
                    ownerType: owner.resource.type,
                    includeProperties: ['uuid', 'token', 'name', 'type', 'online', 'ipAddress' ]
                });
                res.send(device);
            })
            .catch(function(error){
                res.send(400, error);
            });

    },

    updateDevice : function(req, res){
        client({
            method: 'PUT',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/:uuid",
            params : {
                uuid : req.params.uuid
            },
            headers: {
                skynet_auth_uuid : req.headers.skynet_auth_uuid,
                skynet_auth_token : req.headers.skynet_auth_token
            }
        })
            .then(function(result){
                var device =  Resource.makeResourceObject({
                    model: _.findWhere( result.entity.devices, { uuid : req.params.uuid}),
                    type: 'device',
                    uuidProperty: 'uuid',
                    ownerType: owner.resource.type,
                    includeProperties: ['uuid', 'token', 'name', 'type', 'online', 'ipAddress' ]
                });
                res.send(device);
            })
            .catch(function(error){
                res.send(400, error);
            });

    },

    claimDevice : function(req, res){
        client({
            method: 'PUT',
            path: req.protocol + "://" + deviceController.skynetUrl + "/claimdevice/:uuid",
            params : {
                uuid : req.params.uuid,
                overrideIp : req.ip
            },
            headers: {
                skynet_auth_uuid : req.headers.skynet_auth_uuid,
                skynet_auth_token : req.headers.skynet_auth_token
            }
        })
            .then(function(result){
                var device =  Resource.makeResourceObject({
                    model: _.findWhere( result.entity.devices, { uuid : req.params.uuid}),
                    type: 'device',
                    uuidProperty: 'uuid',
                    ownerType: owner.resource.type,
                    includeProperties: ['uuid', 'token', 'name', 'type', 'online', 'ipAddress' ]
                });
                res.send(device);
            })
            .catch(function(error){
                res.send(400, error);
            });
    }

};
module.exports = function (app, passport, config) {

    deviceController.skynetUrl = app.locals.skynetUrl;
    app.get('/api/devices/:uuid', isAuthenticated, deviceController.getDeviceByUUID );
    app.post('/api/devices', isAuthenticated, deviceController.registerDevice );
    app.put('/api/devices/:uuid', isAuthenticated, deviceController.updateDevice );
    app.delete('/api/devices/:uuid', isAuthenticated, deviceController.deleteDevice );
    app.put('/api/devices/:uuid/claim', isAuthenticated, deviceController.claimDevice );

    // Get device info from Skynet
//    app.get('/api/devices/:uuid', function(req, res) {
//
//        request.get(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.params.id,
//        {
//            headers: {
//                'skynet_auth_uuid': req.params.id,
//                'skynet_auth_token': req.query.token
//            }}
//        , function (error, response, body) {
//                console.log("DEVICES", body);
//                var data = JSON.parse(body);
//                res.json(data);
//            });
//
//    });

    // Register device with Skynet
//    app.post('/api/devices/:id', function(req, res) {
//        // console.log(req);
//
//
//        var deviceData = {};
//        deviceData.owner = req.params.id;
//        deviceData.name = req.body.name;
//
//        // flatten array
//        var obj = req.body.keyvals;
//        for (var i in obj) {
//            deviceData[obj[i]["key"]] = obj[i]["value"];
//        }
//        request.post(req.protocol + '://' + app.locals.skynetUrl + '/devices',
//            {form: deviceData}
//            , function (error, response, body) {
//                var data = JSON.parse(body);
//                res.json(data);
//            });
//
//    });

    // Update device with Skynet
//    app.put('/api/devices/:id', function(req, res) {
//        // console.log(req);
//
//        var deviceData = {};
//        deviceData.owner = req.params.id;
//        deviceData.name = req.body.name;
//        deviceData.token = req.body.token;
//
//        // flatten array
//        var obj = req.body.keyvals;
//        for (var i in obj) {
//            deviceData[obj[i]["key"]] = obj[i]["value"];
//        }
//
//        request.put(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.body.uuid,
//            {form: deviceData,
//            headers: {
//                'skynet_auth_uuid': req.body.uuid,
//                'skynet_auth_token': req.body.token
//            }}
//            , function (error, response, body) {
//                var data = JSON.parse(body);
//                res.json(data);
//            });
//
//    });

    // Remove device with Skynet
//    app.delete('/api/devices/:id', function(req, res) {
//
//        if( ! req.query.uuid || ! req.query.token) {
//            res.send(400, {"error" : "missing required query parameters [uuid, token"});
//        }
//        request.del(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + req.params.id,
//            {headers: {
//                'skynet_auth_uuid': req.query.uuid,
//                'skynet_auth_token': req.query.token
//            }}
//            , function (error, response, body) {
//                var data = JSON.parse(body);
//                res.json(data);
//            });
//
//    });

    // Update device with Skynet
//    app.put('/api/claimdevice/:uuid', function(req, res) {
//        // console.log('skynet_override_token', config.skynet_override_token);
//        request.put(req.protocol + '://' + app.locals.skynetUrl + '/claimdevice/' + req.body.uuid + '?overrideIp=' + req.ip,
//            {
//                form: req.body,
//                headers: {'Skynet_override_token': config.skynet.override_token,
//                'skynet_auth_uuid': req.params.uuid,
//                'skynet_auth_token': req.query.token}
//
//            }, function (error, response, body) {
//                var data = JSON.parse(body);
//                res.json(data);
//            });
//
//    });

};
