'use strict';

angular.module('octobluApp')
    .controller('termsController', function($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });
