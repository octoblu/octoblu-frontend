angular.module('octobluApp')
    .directive('flowEditor', function (FlowRenderer) {
        return {
            restrict: 'E',
            templateUrl: '/angular/directives/flow/flow-editor/flow-editor.html',
            replace: true,
            scope: {
                flow: '=',
                selectedNode: '='
            },
            link: function ($scope, element) {
                var renderScope = d3.select(element.find('svg')[0]);
                var flowRenderer = new FlowRenderer(renderScope);
                $scope.$watch('flow', function (newFlow, oldFlow) {
                    if (oldFlow && newFlow !== oldFlow) {
                        flowRenderer.clear();
                    }
                    if (newFlow && newFlow.nodes) {
                        flowRenderer.render(newFlow)
                            .on('flowChanged', function(flow){
                                $scope.$apply();
                            })
                            .on('nodeSelected', function(flowNode){
                                $scope.selectedNode = flowNode;
                                $scope.$apply();
                            });
                    }
                }, true);
            }
        };
    });
