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
            skynetConnection.on('message', processMessage);

            _.each($rootScope.myDevices, function (device) {
                skynetConnection.subscribe({uuid: device.uuid, token: device.token});
            });

            $rootScope.$watch('myDevices', function (myDevices, prevMyDevices) {
                _.each(prevMyDevices, function (device) {
                    skynetConnection.unsubscribe({uuid: device.uuid});
                });

                _.each(myDevices, function (device) {
                    skynetConnection.subscribe({uuid: device.uuid, token: device.token});
                });
            });
        });

        function processMessage(message) {
            $rootScope.$broadcast('skynet:message', message);
            $rootScope.$broadcast('skynet:message:' + message.fromUuid, message);
            if (message.payload && _.has(message.payload, 'online')) {
                var device = _.findWhere($rootScope.myDevices, {uuid: message.fromUuid});
                if (device) {
                    device.online = message.payload.online;
                }
            }
        }

        var service = {
            /**
             * gets the skynetConnection. This is so that when we migrate the
             * device centric apis to the device service, the device service
             * can grab the skynetConnection and make the underlying api calls.
             * @returns {Deferred.promise|*}
             */
            getSkynetConnection: function () {
                var defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    return skynetConnection;
                });
                return promise;
            },

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
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

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
            claimDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    skynetConnection.claimdevice(device, function (data) {
                        console.log('claim device results: ');
                        console.log(data);
                        defer.resolve(data);
                    });
                });

                return promise;
            },

            claimAndUpdateDevice: function (options) {
                var device = _.omit(options, reservedProperties);

                return skynetPromise.then(function(){
                    device.owner = user.skynet.uuid;
                    return service.updateDevice(device);
                })
                .then(function(){
                    $rootScope.myDevices.push(device);
                    return device;
                });
            },

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
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

            registerDevice: function(options){
                var device;
                return service.initializeDevice(options).then(function(result){
                    device = _.extend({}, result, options);
                    return service.updateDevice(device);
                }).then(function(){
                    $rootScope.myDevices.push(device);
                    return device;
                });
            },

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
            initializeDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer(), promise = defer.promise;


                skynetPromise.then(function () {
                    device.owner = user.skynet.uuid;

                    skynetConnection.register(device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                });
                return promise;
            },

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
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

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
            createSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'createSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
            updateSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'updateSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
            deleteSubdevice: function (options) {
                return service.gatewayConfig(_.extend({ method: 'deleteSubdevice' },
                    _.omit(options, reservedProperties)));
            },

            /**
             *
             * @param options
             * @returns {*}
             */
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
    })
;
