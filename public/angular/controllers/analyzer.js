'use strict';

angular.module('e2eApp')
    .controller('analyzerController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {
//
        });
    });