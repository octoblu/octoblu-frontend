angular.module('octobluApp')
    .service('skynetService', function ($q, $cookies, skynetConfig, reservedProperties) {
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

            updateDevice: function (options) {
                var device = _.omit(options, reservedProperties);
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
            registerDevice: function (options) {
                var device = _.omit(options, reservedProperties);
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
            unregisterDevice: function (options) {
                var device = _.omit(options, reservedProperties);
                return skynetPromise.then(function () {
                    var defer = $q.defer(),
                        promise = defer.promise;
                    skynetSocket.emit('unregister', device, function (result) {
                        console.log('registered device!');
                        defer.resolve(result);
                    });
                    return promise;
                });
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
            getMessage : function( cb ){
                return skynetPromise.then(function () {
                    skynetSocket.on('message',cb);
                    return true;
                });
            },
            sendMessage : function(options){
                return skynetPromise.then(function () {
                    skynetSocket.emit('message', options, function (result) {
                        console.log('sending skynet message!');
                    });
                    return true;
                });
            }
        };
        return service;
    });