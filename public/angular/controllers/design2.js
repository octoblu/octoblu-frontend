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

        $scope.updateNodeProperties = function () {
            if (!schemaControl.validate().length) {
                _.extend($scope.editingNode, schemaControl.getValue());
                $scope.editingNode.name = $scope.editingNodeName;
                $scope.editingNode.dirty = true;
                $scope.editingNode.changed = true;
                RED.view.dirty(true);
            }
        };

        nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
            initializeRED();
            RED.sidebar.info = {
                refresh: function (node) {
                    $scope.editingNode = RED.nodes.convertNode(node, true);
                    $scope.editingNodeName = $scope.editingNode.name;
                    $scope.editingNodeSchema = node._def.schema;
                    $scope.$apply();
                },
                clear: function () {
                    $scope.editingNode = undefined;
                    $scope.editingNodeName = undefined;
                    $scope.$apply();
                }
            };
            RED.wsConnect(function () {
                RED.loadSettings($scope, function () {
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
