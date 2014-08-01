angular.module('octobluApp')
    .directive('flowWorkspace', function () {
        return {
            restrict: 'E',
            templateUrl: '/angular/directives/design/flow-workspace/flow-workspace.html',
            replace: true,
            scope: {
                flows: '='
            },
            link : function(scope, el) {
                console.log(el);
            },
            controller: function ($scope) {
            }
        };
    });
