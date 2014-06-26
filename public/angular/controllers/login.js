'use strict';

angular.module('octobluApp')

    .controller('loginController', function ($rootScope, $scope, $state, $cookies, AuthService) {
        $scope.login = function () {
            AuthService.login($scope.email, $scope.password).then(function (user) {
                $rootScope.currentUser = user;
                $state.go('ob.dashboard');
            }, function () {
            });
        }
    });
