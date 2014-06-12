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
};
