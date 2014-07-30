angular.module('octobluApp')
    .controller('design2Controller', function ($rootScope, $scope, $http, $injector, $location, nodeRedService, currentUser) {
        var schemaControl = {};
        $scope.schemaControl = schemaControl;

        var getSessionFlow = function () {
            return $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data, status, headers, config) {
                    console.log('/api/get/flow', data);
                    if (data.flow) {
                        RED.view.importFromCommunity(data.flow);
                    }
                });
        };

        $scope.saveNodeProperties = function () {
            if (!schemaControl.validate().length) {
                $scope.editingNode.properties = schemaControl.getValue();
            }
        };

        nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
            initializeRED();
            RED.sidebar.info = {
                refresh: function (node) {
                    $scope.editingNode = node;
                    $scope.$apply();
                },
                clear: function () {
                    $scope.editingNode = undefined;
                }
            };
            RED.wsConnect(function () {
                RED.loadSettings($scope, function () {
                    getSessionFlow();
                });
            }, currentUser.skynet.uuid, currentUser.skynet.token, port);
        });

        $scope.save = function () {
            RED.save();
        };
    });
