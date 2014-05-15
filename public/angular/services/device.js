angular.module('octobluApp')
    .service('deviceService', function ($http, $cookies) {
        this.getDevice = function(uuid, token, callback) {
            $http.get('/api/devices/' + uuid + '?token=' + token)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.createDevice = function(uuid, formData, callback) {

            $http.post('/api/devices/' + uuid, formData)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.updateDevice = function(uuid, formData, owner, callback) {

            if(owner){
                console.log('updated device owner', owner);
                $http.put('/api/devices/' + uuid + '?token=' + $cookies.skynettoken, formData)
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function(data) {
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
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                        callback({});
                    });

            }

        };

        this.deleteDevice = function(uuid, token, callback) {

            $http.delete('/api/devices/' + uuid + '/' + token)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
    });