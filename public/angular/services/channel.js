angular.module('octobluApp')
    .service('channelService', function ($q, $http) {
        this.getList = function(callback) {
            $http.get('/api/channels/', { cache: true})
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        /**
         * getAllChannelsAndSmartDevices - Gets the combined list of channels and smartDevices;
         * @returns {defer.promise|*}
         */
        this.getAllChannelsAndSmartDevices = function(){
            var defer = $q.defer();
            $q.all([this.getAllChannels(), this.getSmartDevices()])
                .then(function(values){
                    console.log(JSON.stringify(values));
                    defer.resolve(_.flatten(values));
                }).catch(function(error){
                    console.log(JSON.stringify(error));
                   defer.reject(error);
                });
            return defer.promise;
        }

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

        this.getActive = function(uuid, callback) {
            $http.get('/api/channels/'+uuid+'/active', { cache: false})
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        this.getAvailable = function(uuid, callback) {
            $http.get('/api/channels/'+uuid+'/available', { cache: false})
                .success(function(data) { callback(null, data); })
                .error(function(error) {
                    console.log('Error: ' + error);
                    callback(error, null);
                });
        };

        /**
         * HTTP VERB : GET
         *
         * getSmartDevices gets the smart devices that Octoblu supports
         * @returns {defer.promise|*} a promise that will eventually resolve to an array of smart devices
         */
          this.getSmartDevices = function(callback) {
            var defer = $q.defer();
            $http.get('/api/smartdevices', { cache: false})
                .success(function(data) {
                     defer.resolve(data);
                    //  callback(null, data);
                })
                .error(function(error) {
                   defer.reject(error);
                  //  callback(error);
                });
            return defer.promise;
        };

        this.getSmartDevicesHomePage = function(callback) {
          var defer = $q.defer();
          $http.get('/api/smartdevices')
              .success(function(data) {
                   callback(null, data);
              })
              .error(function(error) {
                 callback(error);
              });
        };


        this.getCustomList = function(uuid, callback) {
            $http.get('/api/customchannels/' + uuid, { cache: true})
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
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
    });
