angular.module('octobluApp')
    .controller('flowController', function ($scope, $http, $location, FlowService, FlowNodeTypeService) {
        var activeFlow, schemaControl = {}, originalNode;
        $scope.schemaControl = schemaControl;

        FlowNodeTypeService.getFlowNodeTypes()
            .then(function (flowNodeTypes) {
                $scope.flowNodeTypes = flowNodeTypes;
            });

        FlowService.getAllFlows()
            .then(function (flows) {
                $scope.flows = flows;
                if (flows.length) {
                    activeFlow = flows[0];
                }
            });

        FlowService.getSessionFlow()
            .then(function (sessionFlow) {
                if (sessionFlow) {
                    RED.view.importFromCommunity(sessionFlow);
                }
            });

        $scope.addFlow = function () {
            $scope.flows.push({ name: 'Flow ' + ($scope.flows.length + 1) });
        };

        $scope.isActiveFlow = function (flow) {
            return flow === activeFlow;
        };

        $scope.setActiveFlow = function (flow) {
            activeFlow = flow;
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

        $scope.deploy = function () {
            FlowService.saveAllFlowsAndDeploy(RED.nodes.createCompleteNodeSet());
        };

        $scope.save = function () {
            FlowService.saveAllFlows(RED.nodes.createCompleteNodeSet());
        }
    });
