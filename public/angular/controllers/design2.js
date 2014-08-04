'use strict';
angular.module('octobluApp')
    .controller('design2Controller', function ($scope, $http, $location, FlowService, FlowNodeTypeService, nodeRedService, currentUser) {

        FlowNodeTypeService.getFlowNodeTypes()
            .then(function(flowNodeTypes){
                $scope.flowNodeTypes = flowNodeTypes;
            });

        var schemaControl, originalNode;

        schemaControl = {};
        $scope.schemaControl = schemaControl;

        var getSessionFlow = function () {
            return $http({method: 'GET', url: '/api/get/flow'})
                .success(function (data) {
                    console.log('/api/get/flow', data);
                    if (data.flow) {
                        RED.view.importFromCommunity(data.flow);
                    }
                });
        };

        $scope.updateNodeProperties = function () {
            if (!schemaControl.validate().length) {
                originalNode.node = schemaControl.getValue();
                originalNode.name = $scope.editingNodeName;
                originalNode.dirty = true;
                originalNode.changed = true;
                RED.view.dirty(true);
            }
        };

        nodeRedService.getPort(currentUser.skynet.uuid, currentUser.skynet.token, function (port) {
            initializeRED();

            RED.edit = function(node) {
                originalNode = node;
                RED.view.state(RED.state.EDITING);
                $scope.editingNode = originalNode.node || {};
                $scope.editingNodeName = originalNode.name;
                $scope.editingNodeSchema = originalNode._def.schema;
                $scope.$apply();
            };

            RED.wsConnect(function () {
                RED.loadSettings($scope, function () {
                    getSessionFlow();
                });
            }, currentUser.skynet.uuid, currentUser.skynet.token, port);
        });

        $scope.deploy = function () {
            FlowService.saveAllFlowsAndDeploy(RED.nodes.createCompleteNodeSet());
        };

        $scope.save = function () {
            FlowService.saveAllFlows(RED.nodes.createCompleteNodeSet());
        };

        FlowService.getAllFlows()
            .then(function(flows){
                $scope.flows = flows;
            });
    });
