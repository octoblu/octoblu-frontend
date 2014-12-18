angular.module('octobluApp')
    .directive('billOfMaterials', function( BillOfMaterialsService ) {
        return {
            restrict: 'AE',
            templateUrl: '/angular/directives/bill-of-materials/bill-of-materials.html',
            replace: true,
            scope: {
                flow : '='
            },
            controller: function ($scope, BillOfMaterialsService) {

                $scope.$watch('flow', function(){
                    if(!$scope.flow){
                        return;
                    }
                    BillOfMaterialsService.generate($scope.flow)
                        .then(function(billOfMaterials){
                            $scope.materials = billOfMaterials;
                    });
                });
            }
        }
    });
