'use strict';

angular.module('e2eApp')
    .controller('profileController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function(){
        });
    });