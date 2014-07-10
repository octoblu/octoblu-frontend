angular.module('octobluApp')
    .service('channelService', function ($q, $http) {
        this.getList = function(callback) {
            $http.get('/api/channels', { cache: true})
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        /**
         * Returns all channels available in the system
         * VERB - GET
         * /api/channels/
         * @returns {defer.promise|*}
         */
        this.getAllChannels = function(){
            var defer = $q.defer();
            $http.get('/api/channels', { cache: true})
                .success(function(data) {
                  // console.log('ALLCHANNELS', data);
                    defer.resolve(data);
                })
                .error(function(error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        /**
         * @deprecated - use getActiveChannels
         * @param uuid
         * @param callback
         */
        this.getActive = function(callback) {
            $http.get('/api/channels/active', { cache: false})
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        /**
         * @deprecated - use getAvailableChannels
         * @param uuid
         * @param callback
         */
        this.getAvailable = function(callback) {
            return $http.get('/api/channels/available', { cache: false})
                .success(function(data) { callback(null, data); })
                .error(function(error) {
                    console.log('Error: ' + error);
                    callback(error, null);
                });
        };

        /**
         * gets the activeChannels
         * @param userUUID
         * @returns {*}
         */
        this.getActiveChannels = function(){
            return $http.get('/api/channels/active', { cache: false})
                .then(function(result){
                    return result.data;
                });
        };

        /**
         *
         * @param userUUID
         * @returns {*}
         */
        this.getAvailableChannels = function(){
            return $http.get('/api/channels/available', { cache: false})
                .then(function(result){
                    return result.data;
                });
        };

        /**
         * HTTP VERB : GET
         *
         * getSmartDevices gets the smart devices that Octoblu supports
         * @returns {defer.promise|*} a promise that will eventually resolve to an array of smart devices
         */
          this.getDeviceTypes = function() {
            return $http.get('/api/devicetypes')
                .then(function(result){
                    return result.data;
                });
        };

        this.getCustomList = function() {
            return $http.get('/api/customchannels/', { cache: false})
                .then(function(result){
                    return result.data;
                });
        };

        this.getByName = function(name, callback) {
            $http.get('/api/channels/'+name, { cache: true})
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        this.save = function(channel, callback) {
            var d = angular.toJson(channel);
            $http.put('/api/channels/', d, { cache: true})
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        this.delete = function(name, callback) {
            // return $http.delete('/api/channels/'+name, { cache: false})
            //     .then(function(result){
            //         return result.data;
            //     });
            $http.delete('/api/channels/'+name, { cache: true})
                .success(function(data) {
                    callback(true);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback(false);
                });
        };
    });
