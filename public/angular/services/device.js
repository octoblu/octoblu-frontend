angular.module('octobluApp')
    .service('deviceService', function ($q, $http, skynetService) {
        var myDevices = [];
        var skynetPromise = skynetService.getSkynetConnection();
        var service = {

            getDevices: function (force) {
                var defer = $q.defer();
                if (myDevices && myDevices.length && !force) {
                    defer.resolve(myDevices);
                } else {
                    skynetPromise
                        .then(function (skynetConnection) {
                            skynetConnection.mydevices({}, function (result) {
                                angular.copy(myDevices, result);
                                defer.resolve(result);
                            });
                        });
                }
                return defer.promise;
            },

            registerDevice: function (options) {
                var device;
                return service.initializeDevice(options).then(function (result) {
                    device = _.extend({}, result, options);
                    return service.updateDevice(device);
                }).then(function () {
                    myDevices.push(device);
                });
            },

            initializeDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    device.owner = user.skynet.uuid;

                    skynetConnection.register(device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                });
                return defer.promise;
            },

            claimDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.claimdevice(device, function (data) {
                        defer.resolve(data);
                    });
                });

                return defer.promise;
            },

            updateDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.update(device, function (result) {
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            unregisterDevice: function (options) {
                var device = _.findWhere(myDevices, {uuid: options.uuid}),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.unregister({
                        uuid: options.uuid,
                        token: options.token}, function (result) {

                        if (device) {
                            myDevices.splice(_.indexOf(myDevices, device));
                        }

                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            getUnclaimedDevices: function () {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.localdevices({}, function (result) {
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            gatewayConfig: function (options) {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.gatewayConfig(options, function (result) {
                        defer.resolve(result);
                    });
                });

                return defer.promise;
            },

            createSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'createSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            updateSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'updateSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            deleteSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'deleteSubdevice' },
                    _.omit(options, reservedProperties)));
            }
        };
    });
