angular.module('octobluApp')
    .service('skynetService', function ($q, $rootScope, skynetConfig, AuthService, reservedProperties) {
        var skynetSocket,
            user,
            defer = $q.defer(),
            skynetPromise = defer.promise;

        AuthService.getCurrentUser().then(function (currentUser) {
            user = currentUser;

            skynet({
                'host': skynetConfig.host,
                'port': skynetConfig.port,
                'uuid': user.skynetuuid,
                'token': user.skynettoken
            }, function (e, socket) {
                if (e) {
                    defer.reject(e);
                    console.log('Skynet Error!');
                    console.log(e);
                } else {
                    skynetSocket = socket;
                    console.log('skynet connected');
                    defer.resolve();
                }
            });
            return defer.promise;
        });

        skynetPromise.then(function () {
            console.log('registering for messages');
            skynetSocket.on('message', function (channel, message) {
                console.log('skynet sent a message');
                $rootScope.$emit('skynet:message', message);
            });
        });

        var service = {
            gatewayConfig: function (options) {
                var defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    skynetSocket.emit('gatewayConfig', options, function (result) {
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
                    skynetSocket.emit('update', device, function (result) {
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
                    skynetSocket.emit('register', device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });

                    return promise;
                });
            },

            unregisterDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    skynetSocket.emit('unregister', device, function (result) {
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
                    skynetSocket.emit('message', options, function (result) {
                        console.log('sending skynet message!');
                    });
                });
            }
        };
        return service;
    });