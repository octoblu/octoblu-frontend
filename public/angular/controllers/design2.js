angular.module('octobluApp')
    .controller('design2Controller', function ($rootScope, $scope, $http, $injector, $location, FlowService, nodeRedService, currentUser) {
        var schemaControl, originalNode;

        schemaControl = {};
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
                originalNode.properties = schemaControl.getValue();
                originalNode.name = $scope.editingNodeName;
                originalNode.dirty = true;
                originalNode.changed = true;
                RED.view.dirty(true);
            }
        };

        nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
            initializeRED();
            RED.sidebar.info = {
                refresh: function (node) {
                    originalNode = node;
                    $scope.editingNode = originalNode.properties || {};
                    $scope.editingNodeName = originalNode.name;
                    $scope.editingNodeSchema = originalNode._def.schema;
                    $scope.$apply();
                },
                clear: function () {
                    $scope.editingNode = undefined;
                    $scope.editingNodeName = undefined;
                    $scope.editingNodeSchema = undefined;
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
            FlowService.saveAllFlows(RED.nodes.createCompleteNodeSet());
        }
    });
