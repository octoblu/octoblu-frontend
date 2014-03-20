'use strict';

angular.module('e2eApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, elasticService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {
            var skynetUUID = $cookies.skynetuuid;
            var skynetToken = $cookies.skynettoken;

            console.log(skynetUUID);
            console.log(skynetToken);

            $scope.search = function () {
                if ($scope.searchText !== undefined) {
                    elasticService.search($scope.searchText, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            $scope.results = response;
                        }

                    });


                } else {
                    //TODO - display a modal error

                }

            };
        });
    });

