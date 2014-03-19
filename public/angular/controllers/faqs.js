'use strict';

angular.module('e2eApp')
    .controller('faqsController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function () {

        });
    });