// 'use strict';

// angular.module('octobluApp')
//     .controller('designController', function ($rootScope, $scope, $http, $injector, $location, nodeRedService, currentUser) {
//         var getSessionFlow = function () {
//             $http({method: 'GET', url: '/api/get/flow'})
//                 .success(function (data, status, headers, config) {
//                     console.log('/api/get/flow', data);
//                     if (data.flow) {
//                         RED.view.importFromCommunity(data.flow);
//                     }
//                 });
//         };

//         nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
//             initializeRED();
//             RED.wsConnect(RED.loadSettings, currentUser.skynet.uuid, currentUser.skynet.token, port);
//             getSessionFlow();
//         });

//         $scope.save = function(){
//             RED.save();
//         };
//     });

'use strict';

angular.module('octobluApp')
    .controller('designController', function ($rootScope, $scope, $http, $injector, $location, nodeRedService) {
        $scope.getSessionFlow = function () {
            $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.flow) {
                        var win = angular.element('#designerFrame')[0];
                        win.onload = function () {
                            win.contentWindow.postMessage({flow: data.flow}, $scope.redFrame);
                        };
                    }
                });
        };

        // Get NodeRed port number
        nodeRedService.getPort($scope.currentUser.skynet.uuid, $scope.currentUser.skynet.token, function (data) {
            var uuid         = $scope.currentUser.skynet.uuid,
                token        = $scope.currentUser.skynet.token,
                protocol     = 'https://',
                designerHost = '@designer.octoblu.com';

            if($location.host() === 'localhost'){
                protocol     = 'http://';
                designerHost = 'localhost';
            }

            $scope.redPort = data.replace(/["']/g, "");
            $scope.redFrame = protocol+uuid+":"+token+'@'+designerHost+':'+$scope.redPort;

            $scope.getSessionFlow();

            $scope.designerFrame = {
                skynetid: $scope.currentUser.skynet.uuid,
                skynettoken: $scope.currentUser.skynet.token
            };
        });
    });
