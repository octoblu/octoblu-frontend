'use strict';

angular.module('octobluApp')
    .controller('pricingController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });