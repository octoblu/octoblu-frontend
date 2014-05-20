'use strict';

angular.module('octobluApp')
    .controller('aboutController', function($rootScope, $scope, $http, $injector) {
        $scope.message = 'About page content pending.';
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });