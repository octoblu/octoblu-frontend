angular.module('octobluApp')
    .service('deviceService', function ($q, $http, $cookies) {
        this.getDevice = function (uuid, token, callback) {
            $http.get('/api/devices/' + uuid + '?token=' + token)
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.createDevice = function (uuid, formData, callback) {

            $http.post('/api/devices/' + uuid, formData)
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
        /**
         *
         * @param deviceUUID - the uuid of the device to claim
         * @param owner - object containing skynetuuid and skynettoken of the owner.
         * @param name
         * @returns {*}
         */
        this.claimDevice = function (deviceUUID, owner, name) {
            var defer = $q.defer();
            if (!deviceUUID) {
                defer.reject("deviceUUID is required");
            }
            if (!owner.skynetuuid || !owner.skynettoken) {
                defer.reject("Missing skynetuuid or skynettoken");
            }

            if (!name) {
                defer.reject("Name is required");
            }

           var promise =  $http.put('/api/claimdevice/' + owner.skynetuuid + '?token=' + owner.skynettoken, {
                uuid : deviceUUID,
                name : name
            });

//            .success(function (data) {
//                defer.resolve(data);
//            })
//            .error(function (data) {
//                defer.reject(data);
//            });
            return defer.promise.then(promise);
        };

        /**
         *
         * @param device
         * @param owner
         * @param data
         */
        this.update_Device = function (device, owner, data) {
            var defer = $q.defer();
            if( ! device ){
                defer.reject("device parameter is required");
            }

            if( ! device.uuid ){
                defer.reject("device.uuid is required");
            }

            if( ! owner){
                defer.reject("owner is required");
            }

            if(! owner.skynetuuid || !owner.skynettoken){
                defer.reject("Missing required parameters for owner - skynetuuid, skynettoken");
            }

            return defer.promise.then(
                $http.put('/api/devices/' + device.uuid + '?token=' + owner.skynettoken, data));
        };
        /**
         *
         * @param uuid  - the uuid of the device
         * @param formData - object containing the device properties to update
         * @param owner - the device owner
         * @param callback - callback function notifying caller once the update is complete.
         */
        this.updateDevice = function (uuid, formData, owner, callback) {

            if (owner) {
                console.log('updated device owner', owner);
                $http.put('/api/devices/' + uuid + '?token=' + $cookies.skynettoken, formData)
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                        callback({});
                    });
            } else {
                console.log('updated device claim', uuid, formData);
                formData.claimUuid = formData.uuid;
                formData.token = $cookies.skynettoken;
                console.log('formData', formData);
                // 'skynet_override_token': "w0rldd0m1n4t10n"
                $http.put('/api/claimdevice/' + uuid + '?token=' + $cookies.skynettoken, formData)
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                        callback({});
                    });

            }

        };

        this.deleteDevice = function (uuid, token, callback) {

            $http.delete('/api/devices/' + uuid + '/' + token)
                .success(function (data) {
                    callback(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
        /**
         * Gets the claimed devices for the owner with the given
         * @param uuid - the uuid of the device owner
         * @param token = the token of the device owner
         * @param options
         * object containing the fields to filter for i.e "type" : "gateway"
         * @returns {defer.promise|*}
         */
        this.getClaimedDevices = function (uuid, token, options) {
            var defer = $q.defer();
            // /api/owner/:id/:token/devices/unclaimed
            $http.get('/api/owner/' + uuid + '/' + token + '/devices', { cache: false })
                .success(function (data) {
                    defer.resolve(data);
//                    if (options) {
//                        var filteredDevices = _.findWhere(data, options) || [];
//                        defer.resolve(filteredDevices);
//                    } else {
//                        defer.resolve(data);
//                    }
                })
                .error(function (data) {
                    defer.reject(data);
                });
            return defer.promise;
        };
        /**
         *
         * @param uuid
         * @param token
         * @returns {defer.promise|*}
         */
        this.getUnclaimedDevices = function (uuid, token, options) {
            var defer = $q.defer();
            // /api/owner/:id/:token/devices/unclaimed
            $http.get('/api/owner/' + uuid + '/' + token + '/devices/unclaimed')
                .success(function (data) {
                    var devices = data.devices || [];
                    defer.resolve(devices);
                })
                .error(function (data) {
                    defer.reject(data);
                });
            return defer.promise;
        };

    });