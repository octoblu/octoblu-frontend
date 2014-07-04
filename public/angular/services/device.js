angular.module('octobluApp')
    .service('deviceService', function ($q, $http) {
        var myDevices;

        this.getDevices = function (force) {
            if (myDevices && !force) {
                var defer = $q.defer();
                defer.resolve(myDevices);
                return defer.promise;
            } else {
                return $http.get('/api/devices').then(function (res) {
                   myDevices  = res.data;
                   return myDevices;
                }, function (err) {
                    console.log(err);
                    return [];
                });
            }
        };

        this.createDevice = function (deviceData) {
            return $http.post('/api/devices', deviceData).then(function (res) {
                return res.data;
            });
        };

        this.claimDevice = function (deviceUUID) {
            return $http.put('/api/devices/' + deviceUUID + '/claim', {uuid: deviceUUID}).then(function (res) {
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

        this.getUnclaimedDevices = function () {
            return $http.get('/api/devices/unclaimed').then(function (res) {
                return res.data;
            });
        };
    });