angular.module('octobluApp')
    .service('skynetService', function ($q, $rootScope, skynetConfig, AuthService, reservedProperties) {
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
            skynetConnection.on('message', processMessage);

            _.each($rootScope.myDevices, function (device) {
                console.log('Subscribing for device :' + device.uuid);
                skynetConnection.subscribe({uuid: device.uuid, token: device.token});
            });

            $rootScope.$watch('myDevices', function (myDevices, prevMyDevices) {
                _.each(prevMyDevices, function (device) {
                    console.log('Unsubscribing for device :' + device.uuid);
                    skynetConnection.unsubscribe({uuid: device.uuid});
                });

                _.each(myDevices, function (device) {
                    console.log('Subscribing for device :' + device.uuid);
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
