'use strict';

angular.module('octobluApp')
    .controller('faqsController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });