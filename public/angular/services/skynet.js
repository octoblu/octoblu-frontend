'use strict';
angular.module('octobluApp')
    .service('skynetService', function ($q, $rootScope, $cookies, AuthService, MESHBLU_HOST, MESHBLU_PORT, NotifyService) {
        var user, defer = $q.defer(), skynetPromise = defer.promise;
        var conn = meshblu.createConnection({
            server: MESHBLU_HOST,
            port: MESHBLU_PORT,
            uuid: $cookies.meshblu_auth_uuid,
            token: $cookies.meshblu_auth_token
        });

        conn.on('ready', function (data) {
            console.log('Connected to skynet', data);
            defer.resolve(conn);
        });

        conn.on('notReady', function (message) {
          console.log('notReady', message);
          if (message && message.error) {
            NotifyService.notify(message.error.message);
            return defer.reject(new Error(message.error.message));
          }

          NotifyService.notify('Unable to connect to Meshblu');
          return defer.reject(new Error('Unable to connect to Meshblu'));
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
