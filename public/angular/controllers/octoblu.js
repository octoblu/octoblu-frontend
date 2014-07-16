'use strict';

angular.module('octobluApp')
    .controller('OctobluController', function ($state, $rootScope, AuthService, currentUser, skynetService, myDevices) {
        $rootScope.navIsCollapsed = true;
        $rootScope.currentUser = currentUser;
        $rootScope.myDevices = myDevices;
        $rootScope.logout = function () {
            AuthService.logout()
                .then(function () {
                    $state.go('login');
                });
        };
    });
