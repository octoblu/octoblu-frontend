angular.module('octobluApp')
    .service('deviceService', function ($q, $http) {
        this.getDevices = function () {
            return $http.get('/api/devices');
        };

        this.getDevice = function (deviceUUID) {
            return $http.get('/api/devices/' + deviceUUID);
        };

        this.createDevice = function (deviceData) {
            return $http.post('/api/devices', deviceData);
        };

        this.claimDevice = function (deviceUUID) {
            return $http.put('/api/devices/' + deviceUUID + '/claim', {uuid: deviceUUID});
        };

        this.updateDevice = function (deviceUUID, deviceData) {
            return $http.put('/api/devices/' + deviceUUID, deviceData)
        };

        this.deleteDevice = function (deviceUUID) {
            return $http.delete('/api/devices/' + deviceUUID);
        };

        this.getUnclaimedDevices = function () {
            return $http.get('/api/devices/unclaimed');
        };
    });