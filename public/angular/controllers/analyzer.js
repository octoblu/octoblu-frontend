'use strict';

angular.module('e2eApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, elasticService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {

            $scope.search = function () {
              $scope.results="searching...";
                if ($scope.searchText !== undefined) {
                    elasticService.search($scope.searchText, $scope.skynetuuid, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                          console.log(response);
                            $scope.results = response;
                        }

                    });


                } else {
                    $scope.results="";

                }

            };
        });
    });
