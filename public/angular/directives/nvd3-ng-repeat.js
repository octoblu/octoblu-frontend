'use strict';

angular.module('octobluApp')
    .directive('nvd3NgRepeat', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<div {{graph}} {{graph_options}} data="{{data}}" ></div>',
            scope: {
                data: '=',
		graph: '=',
		graph_options: '='
            },
            link: function (scope, element, attr) {
		scope.graph = attr.graph;
		scope.graph_options = attr.graph_options;
		scope.data = attr.data;
            }
        }
    });
