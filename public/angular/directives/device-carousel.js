'use strict';

angular.module('e2eApp')
    .directive('deviceCarousel', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope : {
                hub : '='

            },
            template: '<div class="owl-carousel owl-theme"></div>',
            controller : 'DeviceController',
            link: function (scope, element, attr, DeviceController){

                scope.$watch('hub', function(current, old){
                     if(! scope.owl ){

                     }
                }) ;


            }
        }
    })
    .controller('DeviceCarouselController' , function($rootScope, $scope, $state){


    });