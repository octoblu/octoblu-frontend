'use strict';

angular.module('e2eApp')
    .controller('adminController', function($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, false, function(){
//            $(".active").removeClass();
//            $("#nav-admin").addClass('active');
//            $("#main-nav").show();
//            $("#main-nav-bg").show();
        });
    });