'use strict';

angular.module('e2eApp')
    .controller('pricingController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function(){
        });
    });