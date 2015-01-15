'use strict';

angular.module('octobluApp')

    .controller('loginController', function ($rootScope, $scope, $state, $location, $window, AuthService) {
        var referrer = $location.search().referrer;
        $scope.login = function () {
            AuthService.login($scope.email, $scope.password).then(function (user) {
                $rootScope.currentUser = user;
                if (referrer) {
                    window.location = referrer + '?uuid=' + user.skynet.uuid + '&token=' + user.skynet.token;
                } else {
                    $state.go('material.home');
                }
            }, function () {
                //error message goes here.
                $scope.errorMsg = "Invalid email or password. ¯\\_(ツ)_/¯";
            });
        };

        $scope.getLoginUrl = function (baseUrl) {
            if (referrer) {
                return baseUrl + '?referrer=' + referrer;
            } else {
                return baseUrl;
            }
        };
    });
