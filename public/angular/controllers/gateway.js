'use strict';

angular.module('e2eApp')
    .controller('gatewayController', function ($rootScope, $scope, $http, $injector, $location, deviceService) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {
            deviceService.getDevice($location.search().uuid, function(data) {
                try {
                    $scope.gatewayFrame = "http://" + data.localhost + ":" + data.port;
                } catch(e) {
                    $scope.gatewayFrame = "";
                }
            });
        });
    });
