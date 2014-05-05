'use strict';

angular.module('octobluApp')
    .controller('docsController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });