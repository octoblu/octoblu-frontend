'use strict';

angular.module('octobluApp')
    .controller('designController', function ($rootScope, $scope, $http, $injector, $location, nodeRedService, currentUser) {
        var getSessionFlow = function () {
            $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data, status, headers, config) {
                    console.log('/api/get/flow', data);
                    if (data.flow) {
                        // var win = angular.element('#designerFrame')[0];
                        // win.onload = function () {
                        RED.view.importFromCommunity(data.flow);
                        //     win.contentWindow.postMessage(data.flow, $scope.redFrame);
                        // };
                    }
                });
        };

        // Get NodeRed port number
        nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
            RED.initializeView();
            RED.wsConnect(RED.loadSettings, currentUser.skynet.uuid, currentUser.skynet.token, port);
            // $scope.redPort = data.replace(/["']/g, "");
        //     $scope.redFrame = "http://" + currentUser.skynetuuid + ":" + currentUser.skynettoken + "@designer.octoblu.com:" + $scope.redPort;

               getSessionFlow();


        //     $scope.designerFrame = {
        //         skynetid: currentUser.skynetuuid,
        //         skynettoken: currentUser.skynettoken
        //     };
        });
    });
