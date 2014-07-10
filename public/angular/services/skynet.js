angular.module('octobluApp')
    .service('skynetService', function ($q, $rootScope, skynetConfig, AuthService, deviceService, reservedProperties) {
        var skynetConnection,
            user,
            defer = $q.defer(),
            skynetPromise = defer.promise;

        AuthService.getCurrentUser().then(function (currentUser) {


            user = currentUser;
            var conn = skynet.createConnection({
                server: skynetConfig.host,
                port: skynetConfig.port,
                uuid: user.skynetuuid,
                token: user.skynettoken
            });

            conn.on('ready', function (data) {
                skynetConnection = conn;
                console.log(data);
                console.log('Connected to skynet');
                defer.resolve();
            });

            conn.on('notReady', function (error) {
                console.log('Skynet Error during connect');
                defer.reject(error);
            });

            return defer.promise;
        });

        skynetPromise.then(function () {
            console.log('registering for messages');
            skynetConnection.on('message', function (message) {
                $rootScope.$broadcast('skynet:message', message);
                $rootScope.$broadcast('skynet:message:' + message.fromUuid, message);
            });

            _.each($rootScope.myDevices, function (device) {
                console.log('Subscribing for device :' + device.uuid);
                skynetConnection.subscribe({uuid: device.uuid});
            });

            $rootScope.$watch('myDevices', function (myDevices, prevMyDevices) {
                _.each(prevMyDevices, function (device) {
                    console.log('Unsubscribing for device :' + device.uuid);
                    skynetConnection.unsubscribe({uuid: device.uuid});
                });

                _.each(myDevices, function (device) {
                    console.log('Subscribing for device :' + device.uuid);
                    skynetConnection.subscribe({uuid: device.uuid});
                });
            });
        });

        var service = {
            gatewayConfig: function (options) {
                var defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    skynetConnection.gatewayConfig(options, function (result) {
                        console.log('got gateway configuration!');
                        defer.resolve(result);
                    });
                });

                return promise;
            },

            updateDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    skynetConnection.update(device, function (result) {
                        console.log('updated device!');
                        defer.resolve(result);
                    });
                });

                return promise;
            },

            registerDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    skynetConnection.register(device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                });
                return promise;
            },

            unregisterDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    skynetConnection.unregister(device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                });

                return promise;
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
            },

            sendMessage: function (options) {
                return skynetPromise.then(function () {
                    skynetConnection.message(options, function (result) {
                        console.log('sending skynet message!');
                        return result;
                    });
                });
            }
        };

        return service;
    });