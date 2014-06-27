'use strict';

angular.module('octobluApp')
    .controller('dashboardController', function ($rootScope, $scope, $http, $injector, $location,
                                                 channelService, userService, currentUser, myDevices) {
        $scope.message = 'Contact page content pending.';
        var dataPoints = [];
        var deviceData = [];
        var chart;

        channelService.getActive(currentUser.skynetuuid, function (data) {
            $scope.channels = data;
        });

        userService.getMessageGraph(currentUser.skynetuuid, 'now-30d/d', 'day', function (data) {
            $scope.messages = data
        });
        $scope.devices = myDevices;
        console.log(myDevices);
    });