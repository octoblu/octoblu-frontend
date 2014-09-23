angular.module('octobluApp')
    .controller('DesignerController', function ($state, $scope, FlowService) {

        FlowService.getAllFlows().then(function (flows) {
            var newActiveFlow = _.first(flows);
            $state.flows = flows;
            FlowService.saveFlow(newActiveFlow).then(function () {
                $state.go('flow', {flowId: newActiveFlow.flowId});
            });
        });

        $scope.getActiveFlow = function () {
            return FlowService.getActiveFlow();
        };

        $scope.setActiveFlow = function (flow) {
            $scope.activeFlow = flow;
            FlowService.setActiveFlow($scope.activeFlow);
        };

        $scope.isActiveFlow = function (flow) {
            return flow === $scope.activeFlow;
        };

        $scope.addFlow = function () {
            var name = 'Flow ' + ($scope.flows.length + 1);
            var newFlow = FlowService.newFlow({name: name});
            FlowService.saveFlow(newFlow).then(function () {
                $state.go('flow', {flowId: newFlow.flowId});
            });
        };

        $scope.deleteFlow = function (flow) {
            var deleteFlowConfirmed = $window.confirm('Are you sure you want to delete ' + flow.name + '?');
            if (deleteFlowConfirmed) {
                FlowService.deleteFlow(flow.flowId).then(function () {
                    $state.go('design')
                });
            }
        };
    });