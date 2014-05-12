angular.module('octobluApp')
    .service('deviceService', function ($http) {
        this.getDevice = function(uuid, callback) {
            $http.get('/api/devices/' + uuid)
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

        this.updateDevice = function(uuid, formData, callback) {

            $http.put('/api/devices/' + uuid, formData)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

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