'use strict';

angular.module('e2eApp')
    .controller('analyzerController', function ($rootScope, $scope, $http, $injector) {
        $rootScope.checkLogin($scope, $http, $injector, true, function(){
//            $(".active").removeClass();
//            $("#nav-analyzer").addClass('active');
//            $("#main-nav").show();
//            $("#main-nav-bg").show();

            $scope.splunkFrame = "http://54.203.249.138:8000?output=embed";
        });
    });