'use strict';

angular.module('octobluApp')
    .controller('designerController', function ($rootScope, $scope, $http, $injector, $location, nodeRedService) {
        $scope.getSessionFlow = function () {
            $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.flow) {
                        var win = angular.element('#designerFrame')[0];
                        win.onload = function () {
                            win.contentWindow.postMessage(data.flow, $scope.redFrame);
                        };
                    }
                });
        };

        // Get NodeRed port number
        nodeRedService.getPort($scope.skynetuuid, $scope.skynettoken, function (data) {
            $scope.redPort = data.replace(/["']/g, "");
            $scope.redFrame = "http://" + $scope.skynetuuid + ":" + $scope.skynettoken + "@designer.octoblu.com:" + $scope.redPort;

            $scope.getSessionFlow();

            $scope.designerFrame = {
                skynetid: $scope.skynetuuid,
                skynettoken: $scope.skynettoken
            };
        });
    });
