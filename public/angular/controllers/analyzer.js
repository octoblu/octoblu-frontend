'use strict';

angular.module('e2eApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, elasticService, ownerService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {

            // Get user devices
            ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
                $scope.devices = data.devices;
                for (var i in $scope.devices) {
                    if($scope.devices[i].type == 'gateway'){
                        $scope.devices.splice(i,1);
                    }
                }
            });


            $scope.currentPage = 1;

            $scope.$watch('currentPage', function(newValue, oldValue) {
              $scope.currentPage = newValue;
              $scope.search(newValue);
            });

            $scope.search = function (currentPage) {
              $scope.results="searching...";
                if ($scope.searchText !== undefined) {
                    elasticService.search($scope.searchText, $scope.skynetuuid, currentPage, $scope.eventCode, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                          $scope.results = response;

                          $scope.totalItems = response.hits.total;
                          $scope.maxSize = 10;

                        }
                    });

                } else {
                    $scope.results="";

                }

            };

            elasticService.getEvents("", function(data) {
                $scope.events = data;
            });

            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };


        });
    });
