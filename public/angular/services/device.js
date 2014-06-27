angular.module('octobluApp')
    .service('deviceService', function ($q, $http) {
        this.getDevices = function () {
            return $http.get('/api/devices').then(function (res) {
                return res.data;
            });
        };

        this.getDevice = function (deviceUUID) {
            return $http.get('/api/devices/' + deviceUUID).then(function (res) {
                return res.data;
            });
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