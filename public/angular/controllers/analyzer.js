'use strict';

angular.module('e2eApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, elasticService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {

            $scope.currentPage = 1;

            $scope.$watch('currentPage', function(newValue, oldValue) {
              $scope.currentPage = newValue;
              $scope.search(newValue);
            });

            $scope.search = function (currentPage) {
              $scope.results="searching...";
                if ($scope.searchText !== undefined) {
                    elasticService.search($scope.searchText, $scope.skynetuuid, currentPage, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                          console.log(response);
                          $scope.results = response;

                          $scope.totalItems = response.hits.total;
                          $scope.maxSize = 10;

                        }

                    });


                } else {
                    $scope.results="";

                }

            };

            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };


        });
    });
