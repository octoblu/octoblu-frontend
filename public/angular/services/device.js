angular.module('octobluApp')
    .service('deviceService', function ($q, $http, AuthService, skynetService, reservedProperties) {
        return AuthService.getCurrentUser()
            .then(function (currentUser) {

                skynetService.getSkynetConnection().then(function (skynetConnection) {
                    var myDevices = [];

                    function addDevice(device) {
                        myDevices.push(device);
                        skynetConnection.unsubscribe({uuid: device.uuid, token: device.token});
                        skynetConnection.subscribe({uuid: device.uuid, token: device.token});
                    }

                    skynetConnection.on('message', function (message) {
                        $rootScope.$broadcast('skynet:message:' + message.fromUuid, message);
                        if (message.payload && _.has(message.payload, 'online')) {
                            var device = _.findWhere(myDevices, {uuid: message.fromUuid});
                            if (device) {
                                device.online = message.payload.online;
                            }
                        }
                    });

                    var service = {
                        getDevices: function (force) {
                            var defer = $q.defer();
                            if (myDevices && myDevices.length && !force) {
                                defer.resolve(myDevices);
                            } else {
                                skynetConnection.mydevices({}, function (result) {
                                    angular.copy([], myDevices);
                                    _.each(result, function (device) {
                                        addDevice(device);
                                    });

                                    defer.resolve(result);
                                });
                            }

                            return defer.promise;
                        },

                        registerDevice: function (options) {
                            return service.initializeDevice(options)
                                .then(function (result) {
                                    var device = _.extend({}, result, options);
                                    return service.updateDevice(device);
                                }).then(function (device) {
                                    addDevice(device);
                                });
                        },

                        initializeDevice: function (options) {
                            var device = _.omit(options, reservedProperties),
                                defer = $q.defer();

                            device.owner = user.skynet.uuid;

                            skynetConnection.register(device, function (result) {
                                defer.resolve(result);
                            });

                            return defer.promise;
                        },

                        claimDevice: function (options) {
                            var device = _.omit(options, reservedProperties),
                                defer = $q.defer();

                            skynetConnection.claimdevice(device, function (data) {
                                defer.resolve(data);
                                options.owner = currentUser.uuid;
                                addDevice(options);
                            });

                            return defer.promise;
                        },

                        updateDevice: function (options) {
                            var safeDevice = _.omit(options, reservedProperties),
                                defer = $q.defer();

                            skynetConnection.update(safeDevice, function (result) {
                                var device = _.findWhere(myDevices, {uuid: options.uuid});
                                if (device) {
                                    angular.copy(result, device);
                                }
                                defer.resolve(result);
                            });

                            return defer.promise;
                        },

                        unregisterDevice: function (options) {
                            var defer = $q.defer();
                            skynetConnection.unregister({
                                uuid: options.uuid,
                                token: options.token}, function (result) {

                                var device = _.findWhere(myDevices, {uuid: options.uuid});
                                if (device) {
                                    myDevices.splice(_.indexOf(myDevices, device));
                                }

                                defer.resolve(result);
                            });

                            return defer.promise;
                        },

                        getUnclaimedDevices: function () {
                            var defer = $q.defer();
                            skynetConnection.localdevices({}, function (result) {
                                defer.resolve(result);
                            });
                            return defer.promise;
                        },

                        gatewayConfig: function (options) {
                            var defer = $q.defer();
                            skynetConnection.gatewayConfig(options, function (result) {
                                defer.resolve(result);
                            });

                            return defer.promise;
                        },

                        createSubdevice: function (options) {
                            return service.gatewayConfig(_.extend({ method: 'createSubdevice' },
                                _.omit(options, reservedProperties)))
                                .then(function(result){
                                    var device = _.findWhere(myDevices, {uuid: options.uuid});
                                    if(device){
                                        device.subdevices.push(_.pick(options, 'name', 'options', 'type'));
                                    }
                                });
                        },

                        updateSubdevice: function (options) {
                            return service.gatewayConfig(_.extend({ method: 'updateSubdevice' },
                                _.omit(options, reservedProperties)))
                        },

                        deleteSubdevice: function (options) {
                            return service.gatewayConfig(_.extend({ method: 'deleteSubdevice' },
                                _.omit(options, reservedProperties)));
                        }
                    };

                    return service;
                });
            });
    });
