angular.module('octobluApp')
    .service('deviceService', function ($q, $http ) {
        
        this.getDevices = function(userUUID, userToken){
            return $http.get('/api/devices', {
                headers: {
                    skynet_auth_uuid  : userUUID,
                    skynet_auth_token : userToken
                }
            }).then(function(result){
                return result.data; 
            }); 
        };
        /**
         *
         * @param deviceUUID
         * @param userUUID
         * @param userToken
         * @returns {*}
         */
        this.getDevice = function (deviceUUID, userUUID, userToken) {
            var url = '/api/devices/' + deviceUUID;

            return $http.get(url, {
                headers: {
                    skynet_auth_uuid  : userUUID,
                    skynet_auth_token : userToken
                }
            }).then(function(result){
                return result.data; 
            }); 
        };

        /**
         *
         * @param userUUID
         * @param userToken
         * @param deviceData
         * @returns {*}
         */
        this.createDevice = function (userUUID, userToken, deviceData ) {
            return $http.post('/api/devices', deviceData, {
                headers: {
                    skynet_auth_uuid  : userUUID,
                    skynet_auth_token : userToken
                }
                }).then(function(result){
                    return result.data; 
            }); 
        };
        /**
         *
         * @param deviceUUID - the uuid of the device to claim
         * @param owner - object containing skynetuuid and skynettoken of the owner.
         * @param name
         * @returns {*}
         */
        this.claimDevice = function (deviceUUID, userUUID, userToken,  name) {
            
           return $http.put('/api/devices/' + deviceUUID + '/claim', {
               name : name,
               owner : userUUID
           }, {
               headers: {
                   skynet_auth_uuid  : userUUID,
                   skynet_auth_token : userToken
               } 
           }).then(function(result){
               return result.data; 
           }); 
        };

        /**
         * 
         * @param deviceUUID
         * @param userUUID
         * @param userToken
         * @param deviceData
         * @returns {*}
         */
        this.updateDevice = function (deviceUUID, userUUID, userToken, deviceData ) {
           return $http.put('/api/devices/' + deviceUUID, deviceData, {
               headers: {
                   skynet_auth_uuid  : userUUID,
                   skynet_auth_token : userToken
               }
               
           }).then(function(result){
               return result.data; 
           }); 
        };
        /**
         * 
         * @param deviceUUID
         * @param userUUID
         * @param userToken
         * @returns {*}
         */
        this.deleteDevice = function (deviceUUID, userUUID, userToken) {

            return $http.get('/api/devices/' + deviceUUID,{
                headers: {
                    skynet_auth_uuid  : userUUID,
                    skynet_auth_token : userToken
                }
            })
                .then(function(result){
                    return result.data;
            });
        };
        /**
         * 
         * @param userUUID
         * @param userToken
         * @returns {*}
         */
        this.getUnclaimedDevices = function (userUUID, userToken) {
           return $http.get('/api/devices/unclaimed',{
                   headers: {
                       skynet_auth_uuid  : userUUID,
                       skynet_auth_token : userToken
                   }
               })
               .then(function(result){
                    return result.data;      
           }); 
        };

    });