'use strict';

angular.module('octobluApp')
    .controller('OctobluController', function ($state, $scope, AuthService, currentUser) {
        $scope.currentUser = currentUser;
        $scope.logout = function () {
            AuthService.logout()
                .then(function () {
                    $state.go('login');
                });
        };
    });