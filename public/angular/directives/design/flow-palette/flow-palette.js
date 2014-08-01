angular.module('octobluApp')
    .directive('flowPalette', function () {
        return {
            restrict: 'E',
            templateUrl: '/angular/directives/design/flow-palette/flow-palette.html',
            replace: true,
            scope: {
                flowNodeTypes: '='
            },
            controller: function ($scope) {
                var flowNodeTypeTemplateUrl = '/angular/directives/design/flow-palette/flow-node-templates/';
                $scope.$watch('flowNodeTypes', function () {
                    $scope.typesByCategory = _.groupBy($scope.flowNodeTypes, 'category');
                });

                $scope.getFlowNodeTypeTemplateUrl = function (flowNodeType) {
                    return flowNodeTypeTemplateUrl + 'default.html';
//                    return flowNodeTypeTemplateUrl + flowNodeType.name + '.html';
                };
            }
        };
    });
