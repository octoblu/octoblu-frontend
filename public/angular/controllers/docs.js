'use strict';

angular.module('e2eApp')
    .controller('docsController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function(){
        });
    });