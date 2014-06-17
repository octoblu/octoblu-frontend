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
        //this gets the devices.
        var user = req.user;
        client({
            method: 'GET',
            path: req.protocol + "://" + deviceController.skynetUrl + "/mydevices",
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token,
                meaninglessheader : true
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
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/" + req.params.uuid,
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
            res.send(400, error.status);
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
            params : req.body,
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
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/" + req.params.uuid,

            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            }

        })
            .then(function (result) {
                res.send(result.entity);
            })
            .catch(function (error) {
                res.send(400, error);
            });
    },

    updateDevice: function (req, res) {
        var user = req.user;
        client({
            method: 'PUT',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices/" + req.params.uuid,
            params: req.body,
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token
            },
            entity : req.body
        })
            .then(function (result) {
              res.send(result.entity);
            })
            .catch(function (error) {
                res.send(400, error);
            });

    },

    claimDevice: function (req, res) {
        var user = req.user;
        if(req.body.owner !== user.skynetuuid ){
            res.send(401, {'error' : 'unauthorized'});
            return;
        }

        client({
            method: 'PUT',
            path: req.protocol + "://" + deviceController.skynetUrl + "/claimdevice/" + req.params.uuid,
            params: {
                "overrideIp" : req.ip
            },
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token,
                Skynet_override_token: deviceController.config.skynet.override_token
            },
            entity: req.body
        }).then(function (result) {
               res.send(result.entity);
            })
            .catch(function (error) {
                res.send(400, error.status );
            });
    },

    getUnclaimedDevices: function (req, res) {
        var user = req.user;
        client({
            method: 'GET',
            path: req.protocol + "://" + deviceController.skynetUrl + "/devices",
            params: {
                "ipAddress": req.ip,
                "owner": null
            },
            headers: {
                skynet_auth_uuid: req.headers.skynet_auth_uuid,
                skynet_auth_token: req.headers.skynet_auth_token,
                skynet_override_token: deviceController.config.skynet.override_token
            }
        }).then(function (result) {

            var devices = createDeviceResources(result.entity.devices, null);
            return res.send(devices);
        }, function (errorResult) {
            return res.send( []);
        });

    },
    getPlugins: function (req, res) {
        // var name = 'name:' + ('\"' + req.query.name + '\"' || '');
        var keywords = 'keywords:' + ('\"' + req.query.keywords + '\"' || '\"skynet-plugin\"');
        // var keywords = ('\"' + req.query.keywords + '\"' || '\"skynet-plugin\"');
        // var qsOptions = {};
        // qsOptions.keywords = req.query.keywords;
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
            setTimeout(function(){
                var data = JSON.parse(result.entity);            
                for (var i = 0; i < data.results.length; i++) {
                    // console.log(data.results[i]);
                    if(data.results[i].homepage.indexOf("https://github.com/") > -1){
                        var url = data.results[i].homepage.split("https://github.com/");
                    } else if(data.results[i].homepage.indexOf("http://npmjs.org/") > -1){
                        var url = data.results[i].homepage.split("http://npmjs.org/");
                    } else if(data.results[i].homepage.indexOf("http://github.com/") > -1){
                        var url = data.results[i].homepage.split("http://github.com/");
                    } else {
                        var url = data.results[i].homepage.split("git@github.com:");
                    }
                    console.log(url);
                    if (url[1].indexOf(".git")){
                        var gitUrl = url[1].split(".git");
                    } else {
                        var gitUrl = url[1];
                    }
                    
                    // console.log(gitUrl);
                    var actualUrl = "https://raw.githubusercontent.com/" + gitUrl;
                    data.results[i].bundle = actualUrl + "/master/bundle.js";
                }
                return res.send(data);
            }, 1000)
        }, function (errorResult) {
            return res.send(errorResult.status.code, []);
        });
    }
};
module.exports = function (app, config) {



    deviceController.skynetUrl = app.locals.skynetUrl;
    deviceController.config = config;
    app.get('/api/devices/unclaimed', isAuthenticated, deviceController.getUnclaimedDevices);
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
            includeProperties: ['uuid', 'token', 'name', 'type', 'online', 'ipAddress', 'localhost' ]
        });
    }) || [];
};
