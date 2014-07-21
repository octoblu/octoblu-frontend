angular.module('octobluApp')
    .service('deviceService', function ($q, $http, skynetService) {
        var myDevices = [];
        var skynetPromise = skynetService.getSkynetConnection();
        var service = {

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

            /**
             *
             * @param options
             * @returns {Deferred.promise|*}
             */
            registerDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer(), promise = defer.promise;

                skynetPromise.then(function () {
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
            }
        };

        this.getDevices = function (force) {
            if (myDevices && myDevices.length && !force) {
                var defer = $q.defer();
                defer.resolve(myDevices);
                return defer.promise;
            } else {
                return $http.get('/api/devices').then(function (res) {
                   angular.copy(res.data, myDevices);
                   return myDevices;
                }, function (err) {
                    console.log(err);
                    return angular.copy([], myDevices);
                });
            }
        };

        this.createDevice = function (deviceData) {
            return $http.post('/api/devices', deviceData).then(function (res) {
                return res.data;
            });
        };

        this.claimDevice = function (deviceUUID) {
            return $http.put('/api/devices/' + deviceUUID + '/claim', {uuid: deviceUUID}).then(function (res) {
                myDevices.push(res.data);
                return res.data;
            });
        };

        this.updateDevice = function (deviceUUID, deviceData) {
            return $http.put('/api/devices/' + deviceUUID, deviceData).then(function (res) {
                return res.data;
            });
        };

        this.deleteDevice = function (deviceUUID) {
            return $http.delete('/api/devices/' + deviceUUID).then(function (res) {
                return res.data;
            });
        };

        this.getUnclaimedDevices = function () {
            return $http.get('/api/devices/unclaimed').then(function (res) {
                return res.data;
            });
        };
    });
