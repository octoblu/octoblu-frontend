angular.module('octobluApp')
    .service('skynetService', function ($q, $cookies, skynetConfig) {
        var skynetSocket,
            defer = $q.defer(),
            skynetPromise = defer.promise;
        skynet({
            'host': skynetConfig.host,
            'port': skynetConfig.port,
            'uuid': $cookies.skynetuuid,
            'token': $cookies.skynettoken
        }, function (e, socket) {
            if (e) {
                console.log(e.toString());
            } else {
                skynetSocket = socket;
                defer.resolve();
            }
        });

        return {
            gatewayConfig: function (options) {
                return skynetPromise.then(function () {
                    var defer = $q.defer(),
                        promise = defer.promise;
                    skynetSocket.emit('gatewayConfig', options, function (result) {
                        console.log('got gateway configuration!');
                        defer.resolve(result)
                    });
                    return promise;
                });
            }
        };
    });