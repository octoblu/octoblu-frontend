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

        var service = {
            gatewayConfig: function (options) {
                return skynetPromise.then(function () {
                    var defer = $q.defer(),
                        promise = defer.promise;
                    skynetSocket.emit('gatewayConfig', options, function (result) {
                        console.log('got gateway configuration!');
                        defer.resolve(result);
                    });
                    return promise;
                });
            },

            updateDevice : function(options){
                var device = _.clone(options);
                delete device['$$hashKey'];
                delete device['_id'];
                return skynetPromise.then(function () {
                    var defer = $q.defer(),
                        promise = defer.promise;
                    skynetSocket.emit('update', device, function (result) {
                        console.log('updated device!');
                        defer.resolve(result);
                    });
                    return promise;
                });

            },
            registerDevice : function(options){
                var device = _.clone(options);
                delete device['$$hashKey'];
                delete device['_id'];
                return skynetPromise.then(function () {
                    var defer = $q.defer(),
                        promise = defer.promise;
                    skynetSocket.emit('register', device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                    return promise;
                });

            },
            unregisterDevice : function(options){
                return skynetPromise.then(function () {
                    var defer = $q.defer(),
                        promise = defer.promise;
                    skynetSocket.emit('unregister', options, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                    return promise;
                });

            }
        };
        return service;
    });