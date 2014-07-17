angular.module('octobluApp')
    .service('skynetService', function ($q, $rootScope, skynetConfig, AuthService) {
        var user, defer = $q.defer(), skynetPromise = defer.promise;

        AuthService.getCurrentUser().then(function (currentUser) {

            user = currentUser;
            var conn = skynet.createConnection({
                server: skynetConfig.host,
                port: skynetConfig.port,
                uuid: user.skynetuuid,
                token: user.skynettoken
            });

            conn.on('ready', function (data) {
                console.log(data);
                console.log('Connected to skynet');
                defer.resolve(conn);
            });

            conn.on('notReady', function (error) {
                console.log('Skynet Error during connect');
                defer.reject(error);
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

            getSkynetConnection: function () {
                return skynetPromise.then(function (skynetConnection) {
                    return skynetConnection;
                });

            },

            sendMessage: function (options) {
                return skynetPromise.then(function (skynetConnection) {

                var defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
                    console.log('sending message.');
                    skynetConnection.message(options, function (result) {
                        console.log('meshblu response:', result);
                        defer.resolve(result);
                    });
                });
                return promise;
            }
        };
    })
;