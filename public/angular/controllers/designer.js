'use strict';

angular.module('e2eApp')
    .controller('designerController', function($rootScope, $scope, $http, $injector, $location, nodeRedService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {
            // $(document).trigger("nav-close");

            // Get NodeRed port number
            nodeRedService.getPort($scope.skynetuuid, $scope.skynettoken, function(data) {
                $scope.redPort = data.replace(/["']/g, "");
                $scope.redFrame = "http://" + $scope.skynetuuid + ":" + $scope.skynettoken + "@designer.octoblu.com:" + $scope.redPort;

                $scope.designerFrame = {
                    skynetid: $scope.skynetuuid,
                    skynettoken: $scope.skynettoken
                };
            });

        });

    });