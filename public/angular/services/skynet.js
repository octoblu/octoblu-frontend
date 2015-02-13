'use strict';
angular.module('octobluApp')
    .service('skynetService', function ($q, $rootScope, skynetConfig, AuthService) {
        var user, defer = $q.defer(), skynetPromise = defer.promise;

        AuthService.getCurrentUser().then(function (currentUser) {

            user = currentUser;
            var conn = meshblu.createConnection({
                server: skynetConfig.host,
                port: skynetConfig.port,
                uuid: user.skynet.uuid,
                token: user.skynet.token
            });

            conn.on('ready', function (data) {
                console.log('Connected to skynet', data);
                defer.resolve(conn);
            });

            conn.on('notReady', function (error) {
                if (error && user.skynet.uuid === error.uuid) {
                    console.log('Skynet Error during connect', error);
                    defer.reject(error);
                }
            });

            return skynetPromise;
        });

        skynetPromise.then(function (skynetConnection) {
            skynetConnection.on('message', function (message) {
                $rootScope.$broadcast('skynet:message', message);
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

        return {
            getSkynetConnection: function () {
                return skynetPromise.then(function (skynetConnection) {
                    return skynetConnection;
                });
            },

            sendMessage: function (options) {
                return skynetPromise.then(function (skynetConnection) {

                    var defer = $q.defer(), promise = defer.promise;

                    skynetPromise.then(function () {
                        skynetConnection.message(options, function (result) {
                            defer.resolve(result);
                        });
                    });
                    return promise;
                });
            }
        }
    });
