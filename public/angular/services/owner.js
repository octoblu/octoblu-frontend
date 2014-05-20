angular.module('octobluApp')
    .service('ownerService', function ($q, $http) {
        this.getDevices = function(uuid, token, callback) {

            $http.get('/api/owner/' + uuid + '/' + token + '/devices')
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
           return $http({
                url: '/api/owner/gateways/' + uuid + '/' + token,
                method: 'get',
                params: {
                    devices: includeDevices
                }
            }).success(function(data) {
               if(callback ){
                   callback(null, data);
               }
            })
            .error(function(error) {
                console.log('Error: ' + error);
                   if(callback){
                       callback(error, null);
                   }
            });
        };

        /**
         *
         * @param uuid
         * @param token
         */
        this.getClaimedGateways = function(owner){
            var defer = $q.defer();
            // /api/owner/:id/:token/devices/unclaimed
            if( ! owner ){
                defer.reject("owner is required");
            }
            if( ! owner.skynetuuid || ! owner.skynettoken ){
                defer.reject("Missing required parameters [skynetuuid, skynettoken]");
            }
            $http.get('/api/owner/' + owner.skynetuuid + '/' + owner.skynettoken + '/gateways', { cache: false })
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data) {
                    defer.reject(data);
                });
            return defer.promise;
        };

    });
