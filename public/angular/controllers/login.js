'use strict';

angular.module('octobluApp')

    .controller('loginController', function ($rootScope, $scope, $state, $location, $window, AuthService) {
        $scope.login = function () {
            AuthService.login($scope.email, $scope.password).then(function (user) {
                $rootScope.currentUser = user;
                var referrer = $location.search().referrer;
                if (referrer) {
                    window.location = referrer;
                } else {
                    $state.go('ob.dashboard');
                }
            }, function () {
                //error message goes here.
            });
        }
    });
