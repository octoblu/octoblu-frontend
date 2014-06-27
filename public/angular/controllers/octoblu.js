'use strict';

angular.module('octobluApp')
    .controller('OctobluController', function($scope, AuthService, currentUser) {
        console.log('octoblu here');
        $scope.currentUser = currentUser;

        $scope.logout = function () {
            AuthService.logout()
                .then(function () {
                    $state.go('login');
                });
        };
    });