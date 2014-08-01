angular.module('octobluApp')
    .directive('flowWorkspace', function () {
        return {
            restrict: 'E',
            templateUrl: 'angular/directives/design/flow-workspace/flow-workspace.html',
            replace: true,
            scope: {
                flows: '='
            },
            controller: function ($scope) {
                var flowNodeTypeTemplateUrl = '/angular/directives/design/flow-palette/flow-node-templates/';
                $scope.$watch('flowNodeTypes', function () {
                    $scope.typesByCategory = _.groupBy($scope.flowNodeTypes, 'category');
                });

                $scope.getFlowNodeTypeTemplateUrl = function (flowNodeType) {
                    return flowNodeTypeTemplateUrl + 'default.html';
                };
            }
        };
    });
