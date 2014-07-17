angular.module('octobluApp')
    .service('skynetService', function ($q, $rootScope, skynetConfig, AuthService) {
        var skynetConnection, user, defer = $q.defer(), skynetPromise = defer.promise;

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
            skynetConnection.on('message', function (message) {
                $rootScope.$broadcast('skynet:message', message);
            });
        });

        return {

            getSkynetConnection: function () {
                var defer = $q.defer();

                skynetPromise.then(function () {
                    return skynetConnection;
                });

                return defer.promise();
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
    })
;
