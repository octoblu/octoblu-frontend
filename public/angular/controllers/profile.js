'use strict';

angular.module('octobluApp')
    .controller('profileController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });