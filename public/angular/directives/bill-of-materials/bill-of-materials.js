angular.module('octobluApp')
    .directive('billOfMaterials', function () {
        return {
            restrict: 'AE',
            templateUrl: '/angular/directives/bill-of-materials/bill-of-materials.html',
            replace: true,
            scope: {
                materials: '='
            },
            controller: function ($scope) {
                
            }
        }
    });
