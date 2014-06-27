'use strict';

angular.module('octobluApp')

    .controller('loginController', function ($rootScope, $scope, $state, AuthService) {
        $scope.login = function () {
            AuthService.login($scope.email, $scope.password).then(function (user) {
                $rootScope.currentUser = user;
                $state.go('ob.dashboard');
            }, function () {
                //error message goes here.
            });
        }
    });
