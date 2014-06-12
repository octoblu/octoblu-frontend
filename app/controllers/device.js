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

    getDevices: function (req, res) {

        var user = req.user;
        client({
            method: 'GET',
            path: req.protocol + "://" + deviceController.skynetUrl + "/mydevices",
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            }
        })
            .then(function (result) {
                var devices = createDeviceResources(result.entity.devices, user);
                res.send(devices);
            })
            .catch(function (errorResult) {
                //Log the error from skynet but send an empty array list to the user.
                console.log("Result Skynet : ");
                console.log(errorResult.status.code);
                console.log(errorResult.status.text);
                res.send(200, []);
            });
    },

    getDeviceByUUID: function (req, res) {
        var user = req.user;
        client({
            method: 'GET',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/:uuid",
            params: {
                uuid: req.params.uuid
            },
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            }
        })
            .then(function (result) {
                var devices = createDeviceResources(result.entity.devices, user);
                var device = _.findWhere(devices, {uuid: req.params.uuid});
                res.send(device);
            })
            .catch(function (error) {
                res.send(400, error);
            });
    },

    createDevice: function (req, res) {
        client({
            method: 'POST',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices",
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            },
            entity: req.body
        })
            .then(function (result) {
                var devices = createDeviceResources(result.entity.devices, user);
                var device = _.findWhere(devices, {uuid: req.params.uuid});
                res.send(device);
            })
            .catch(function (error) {
                res.send(400, error);
            });

    },

    deleteDevice: function (req, res) {
        var user = req.user;
        client({
            method: 'DELETE',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/:uuid",
            params: {
                uuid: req.params.uuid
            },
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            }
        })
            .then(function (result) {
                var devices = createDeviceResources(result.entity.devices, user);
                var device = _.findWhere(devices, {uuid: req.params.uuid});
                res.send(device);
            })
            .catch(function (error) {
                res.send(400, error);
            });
    },

    updateDevice: function (req, res) {
        var user = req.user;
        client({
            method: 'PUT',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/:uuid",
            params: {
                uuid: req.params.uuid
            },
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            }
        })
            .then(function (result) {
                var devices = createDeviceResources(result.entity.devices, user);
                var device = _.findWhere(devices, {uuid: req.params.uuid});
                res.send(device);
            })
            .catch(function (error) {
                res.send(400, error);
            });

    },

    claimDevice: function (req, res) {
        var user = req.user;
        var deviceData = { owner: user.resource.uuid, name: req.body.name };
        client({
            method: 'PUT',
            path: req.protocol + "://" + deviceController.skynetUrl + "/claimdevice/:uuid",
            params: {
                uuid: req.params.uuid,
                overrideIp: req.ip
            },
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            },
            entity: deviceData
        })
            .then(function (result) {
                var devices = createDeviceResources(result.entity.devices, user);
                var device = _.findWhere(devices, {uuid: req.params.uuid});
                res.send(device);
            })
            .catch(function (error) {
                res.send(400, error);
            });
    },

    getUnclaimedDevices: function (req, res) {
        var user = req.user;
        client({
            method: 'GET',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices",
            params: {
                ipAddress: req.ip,
                owner: null
            },
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token,
                skynet_override_token: config.skynet.override_token
            }
        }).then(function (result) {
            var devices = createDeviceResources(result.entity.devices, null);
            var device = _.findWhere(devices, {uuid: req.params.uuid});
            res.send(device);
        }, function (errorResult) {
            return res.send(errorResult.status.code, []);
        });

    },
    getPlugins: function (req, res) {
        var keywords = 'keywords:' + (req.query.keywords || '\"skynet-plugin\"');
        client({
            method: 'GET',
            path: 'http://npmsearch.com/query',
            params: {
                q: keywords,
                fields: 'name,author,description,repository,homepage,dependencies',
                start: 0,
                size: 100,
                sort: 'rating:desc'
            }
        }).then(function (result) {
            return res.send(result.entity);
        }, function (errorResult) {
            return res.send(errorResult.status.code, []);
        });
    }
};
module.exports = function (app) {

    deviceController.skynetUrl = app.locals.skynetUrl;
    app.get('/api/devices/plugins', deviceController.getPlugins);
    app.get('/api/devices', isAuthenticated, deviceController.getDevices);
    app.get('/api/devices/:uuid', isAuthenticated, deviceController.getDeviceByUUID);
    app.post('/api/devices', isAuthenticated, deviceController.createDevice);
    app.put('/api/devices/:uuid', isAuthenticated, deviceController.updateDevice);
    app.delete('/api/devices/:uuid', isAuthenticated, deviceController.deleteDevice);
    app.put('/api/devices/:uuid/claim', isAuthenticated, deviceController.claimDevice);
};

function createDeviceResources(devices, owner) {
    return _.map(devices, function (device) {
        return Resource.makeResourceObject({
            model: device,
            type: 'device',
            uuidProperty: 'uuid',
            ownerType: owner ? owner.resource.type : undefined,
            includeProperties: ['uuid', 'token', 'name', 'type', 'online', 'ipAddress' ]
        });
    }) || [];
}