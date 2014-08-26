'use strict';
angular.module('octobluApp')
    .service('channelService', function ($q, $http) {
        var customchannels = [];
        var activechannels = [];
        var availablechannels = [];

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
        this.getActiveChannels = function(force){
            // return $http.get('/api/channels/active', { cache: false})
            //     .then(function(result){
            //         return result.data;
            //     });
            if (activechannels && activechannels.length && !force) {
                var defer = $q.defer();
                defer.resolve(activechannels);
                return defer.promise;
            } else {
                return $http.get('/api/channels/active').then(function (res) {
                   activechannels.length = 0;
                   activechannels.push.apply(activechannels, res.data);
                   return activechannels;
                }, function (err) {
                    console.log(err);
                    activechannels.length = 0;
                    return activechannels;
                });
            }
        };

        this.getActiveChannelByName = function(name){
            return this.getActiveChannels().then(function(channels){
                return _.findWhere(channels, {name: name});
            });
        };

        /**
         *
         * @param userUUID
         * @returns {*}
         */
        this.getAvailableChannels = function(force){
            // return $http.get('/api/channels/available', { cache: false})
            //     .then(function(result){
            //         return result.data;
            //     });
            if (availablechannels && availablechannels.length && !force) {
                var defer = $q.defer();
                defer.resolve(availablechannels);
                return defer.promise;
            } else {
                return $http.get('/api/channels/available').then(function (res) {
                    availablechannels.length = 0;
                    availablechannels.push.apply(availablechannels, res.data);
                    return availablechannels;
                }, function (err) {
                    console.log(err);
                    availablechannels.length = 0;
                    return availablechannels;
                });
            }
        };

        /**
         * HTTP VERB : GET
         *
         * getSmartDevices gets the smart devices that Octoblu supports
         * @returns {defer.promise|*} a promise that will eventually resolve to an array of smart devices
         */
          this.getNodeTypes = function() {
            return $http.get('/api/nodetypes')
                .then(function(result){
                    return result.data;
                });
        };

        this.getCustomList = function(force) {
            // return $http.get('/api/customchannels/', { cache: false})
            //     .then(function(result){
            //         return result.data;
            //     });
            if (customchannels && customchannels.length && !force) {
                var defer = $q.defer();
                defer.resolve(customchannels);
                return defer.promise;
            } else {
                return $http.get('/api/customchannels/').then(function (res) {
                   angular.copy(res.data, customchannels);
                   return customchannels;
                }, function (err) {
                    console.log(err);
                    return angular.copy([], customchannels);
                });
            }
        };

        this.getChannelActivationById = function(channelId){
            return this.getActiveChannels().then(function(channels){
                return _.findWhere(channels, {channelid: channelId});
            });
        };

        this.getById = function(channelId){
            return $http.get('/api/channels/' + channelId).then(function(response){
                return response.data;
            });
        };

        this.get = function(id, callback) {
            $http.get('/api/channels/'+id, { cache: false})
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
            $http.put('/api/channels/', d, { cache: false})
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        this.delete = function(channelId, callback) {
            $http.delete('/api/channels/'+channelId, { cache: false})
                .success(function(data) {
                    callback(true);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback(false);
                });
        };
    });
