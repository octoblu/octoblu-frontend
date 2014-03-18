angular.module('e2eApp')
    .service('channelService', function ($http) {
        this.getList = function(callback) {
            $http.get('/api/channels/', { cache: true})
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
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
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        this.getSmartDevices = function(callback) {
            $http.get('/api/smartdevices/', { cache: true})
                .success(function(data) { callback(data); })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
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
