angular.module('octobluApp')
    .controller('design2Controller', function ($rootScope, $scope, $http, $injector, $location, nodeRedService, FlowService, currentUser) {
        var getSessionFlow = function () {
            return $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data, status, headers, config) {
                    console.log('/api/get/flow', data);
                    if (data.flow) {
                        RED.view.importFromCommunity(data.flow);
                    }
                });
        };

        nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
            initializeRED();
            RED.wsConnect(function () {
                RED.loadSettings($scope, function(){
                    getSessionFlow();
                });
            }, currentUser.skynet.uuid, currentUser.skynet.token, port);
        });

        $scope.deploy = function () {
            RED.save();
        };

        $scope.save = function () {
            console.log(RED.nodes.createCompleteNodeSet());
            FlowService.saveAllFlows(RED.nodes.createCompleteNodeSet());
        }
    });
