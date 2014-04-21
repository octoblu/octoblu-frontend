'use strict';

angular.module('e2eApp')
    .controller('designerController', function($rootScope, $scope, $http, $injector, $location, nodeRedService) {

        $scope.getSessionFlow = function () {
            $http({method: 'GET', url: '/api/get/flow'})
            .success(function(data, status, headers, config) {
                if(data.flow){
                    var win = angular.element('#designerFrame')[0];
                    win.onload = function(){
                        win.contentWindow.postMessage(data.flow, $scope.redFrame);
                    };
                }
            });
        };

        $rootScope.checkLogin($scope, $http, $injector, true, function () {
            // $(document).trigger("nav-close");

            // Get NodeRed port number
            nodeRedService.getPort($scope.skynetuuid, $scope.skynettoken, function(data) {
                $scope.redPort = data.replace(/["']/g, "");
                $scope.redFrame = "http://" + $scope.skynetuuid + ":" + $scope.skynettoken + "@designer.octoblu.com:" + $scope.redPort;

                $scope.getSessionFlow();

                $scope.designerFrame = {
                    skynetid: $scope.skynetuuid,
                    skynettoken: $scope.skynettoken
                };
            });
        });

    });
