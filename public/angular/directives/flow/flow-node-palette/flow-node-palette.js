angular.module('octobluApp')
    .directive('flowNodePalette', function () {
        return {
            restrict: 'E',
            templateUrl: '/angular/directives/flow/flow-node-palette/flow-node-palette.html',
            replace: true,
            scope: {
                flowNodeTypes: '='
            },
            controller: 'FlowNodePaletteController'
        };
    });
