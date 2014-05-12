angular.module('octobluApp')
    .service('ownerService', function ($http) {
        this.getDevices = function(uuid, token, callback) {

            $http.get('/api/owner/devices/' + uuid + '/' + token)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.getGateways = function(uuid, token, includeDevices, callback) {
            // $http.get('/api/owner/gateways/' + uuid + '/' + token)
            $http({
                url: '/api/owner/gateways/' + uuid + '/' + token,
                method: 'get',
                params: {
                    devices: includeDevices
                }
            }).success(function(data) {
                callback(null, data);
            })
                .error(function(error) {
                    console.log('Error: ' + error);
                    callback(error, null);
                });

        };
    });
