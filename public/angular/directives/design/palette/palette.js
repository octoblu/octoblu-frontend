angular.module('octobluApp')
    .directive('palette', function () {
        return {
            restrict: 'E',
            templateUrl: 'angular/directives/design/palette/palette.html',
            replace: true,
            scope: {
            },
            controller: function ($scope) {
            }
        };
    });
