// 'use strict';

'use strict';

angular.module('octobluApp')
    .controller('designController', function (currentUser, $rootScope, $scope, $http, $injector, $location, nodeRedService) {
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
        nodeRedService.getPort($scope.currentUser.skynet.uuid, $scope.currentUser.skynet.token, function (data) {
            $scope.redPort = data.replace(/["']/g, "");
            $scope.redFrame = "https://" + $scope.currentUser.skynet.uuid + ":" + $scope.currentUser.skynet.token + "@designer.octoblu.com:" + $scope.redPort;
//            $scope.redFrame = 'https://'+ currentUser.skynet.uuid +':' + current.skynet.uuid + '@designer.octoblu.com:1066';

            $scope.getSessionFlow();

            $scope.designerFrame = {
                skynetid: $scope.currentUser.skynet.uuid,
                skynettoken: $scope.currentUser.skynet.token
            };
        });

        $scope.resetNodeRed = function () {
            $scope.resetting = true;
            $http.get('http://designer.octoblu.com:1025/red/restart/' + currentUser.skynet.uuid + '?token=' + currentUser.skynet.token + '&branch=master')
                .then(function (result) {
                    $scope.resetting = false;
                    setTimeout(function(){
                        location.reload();
                    }, 2000);

                }, function (result) {
                    $scope.resetting = false;
                    location.reload();
                });
        }

    });