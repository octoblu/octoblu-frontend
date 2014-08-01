angular.module('octobluApp')
    .directive('palette', function () {
        return {
            restrict: 'E',
            templateUrl: 'angular/directives/design/flow-editor/flow-editor.html',
            replace: true,
            scope: {
                flowNodeTypes: '='
            },
            controller: function ($scope) {
                var flowNodeTypeTemplateUrl = '/angular/directives/design/palette/flow-node-templates/';
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
