'use strict';

angular.module('e2eApp')
    .controller('adminController', function($rootScope, $scope, $cookies, $state, mockService) {
        // TODO: Change to getDevices
        mockService.getUserDevices($cookies.skynetuuid, $cookies.skynettoken, function(data) {
            if (data.devices) {
                $scope.devices = data.devices;
            }
        });

        mockService.getUserPeople($cookies.skynetuuid, function(data) {
            if (data.people) {
                $scope.people = data.people;
            }
        });

        mockService.getUserGroups($cookies.skynetuuid, function(data) {
            if (data.groups) {
                $scope.groups = data.groups;
            }
        });
    })
    .controller('adminGroupDetailController', function($rootScope, $scope, $cookies) {

    })
    .controller('invitationController', function($rootScope, $scope, $cookies) {
        //Send the invitation
        $scope.send = function(){

        };

    });