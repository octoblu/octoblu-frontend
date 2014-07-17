angular.module('octobluApp')
    .service('deviceService', function ($q, $http) {
        var myDevices = [];

        this.getDevices = function (force) {
            if (myDevices && myDevices.length && !force) {
                var defer = $q.defer();
                defer.resolve(myDevices);
                return defer.promise;
            } else {
                return $http.get('/api/devices').then(function (res) {
                   angular.copy(res.data, myDevices);
                   return myDevices;
                }, function (err) {
                    console.log(err);
                    return angular.copy([], myDevices);
                });
            }
        };

        this.getDeviceByUUID = function(uuid, force) {
            return this.getDevices(force).then(function(devices){
                return _.findWhere(devices, {uuid: uuid});
            });
        },

        this.getGateways = function() {
            return this.getDevices().then(function(devices){
                return _.where(devices, {type: 'gateway'});
            });
        }

        this.createDevice = function (deviceData) {
            return $http.post('/api/devices', deviceData).then(function (res) {
                return res.data;
            });
        };

        this.claimDevice = function (deviceUUID) {
            return $http.put('/api/devices/' + deviceUUID + '/claim', {uuid: deviceUUID}).then(function (res) {
                myDevices.push(res.data);
                return res.data;
            });
        };

        this.updateDevice = function (deviceUUID, deviceData) {
            return $http.put('/api/devices/' + deviceUUID, deviceData).then(function (res) {
                return res.data;
            });
        };

        this.deleteDevice = function (deviceUUID) {
            return $http.delete('/api/devices/' + deviceUUID).then(function (res) {
                return res.data;
            });
        };

        this.getUnclaimed = function(type){
            if(type === 'gateway') {
                return this.getUnclaimedGateways();
            }

            return this.getUnclaimedDevices();
        };

        this.getUnclaimedDevices = function () {
            return this.getUnclaimedNodes().then(function(unclaimedNodes){
                return _.filter(unclaimedNodes, function(unclaimedNode){
                    return unclaimedNode.type !== 'gateway';
                });
            });
        };

        this.getUnclaimedGateways = function () {
            return $http.get('/api/devices/unclaimed').then(function (res) {
                return _.where(res.data, {type: 'gateway'});
            });
        };

        this.getUnclaimedNodes = function () {
            return $http.get('/api/devices/unclaimed').then(function (res) {
                return res.data;
            });
        };
    });
