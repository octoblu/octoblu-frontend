'use strict';

angular.module('e2eApp')
    .controller('contactController', function($rootScope, $scope, $http, $injector) {
        $scope.message = 'Contact page content pending.';
        $rootScope.checkLogin($scope, $http, $injector, false, function(){

        });
    });