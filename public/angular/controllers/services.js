'use strict';

angular.module('e2eApp')
    .controller('servicesController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function(){
        });
    });