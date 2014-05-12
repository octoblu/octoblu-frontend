'use strict';

angular.module('octobluApp')
    .controller('gatewayController', function ($rootScope, $scope, $http, $injector, $location, deviceService) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {
            deviceService.getDevice($location.search().uuid, $location.search().token, function(data) {
                try {
                    $scope.gatewayFrame = "http://" + data.localhost + ":" + data.port;
                } catch(e) {
                    $scope.gatewayFrame = "";
                }
            });
        });
    });
