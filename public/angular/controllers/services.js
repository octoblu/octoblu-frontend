'use strict';

angular.module('octobluApp')
    .controller('servicesController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });