'use strict';

angular.module('e2eApp')
    .directive('deviceCarousel', function () {
        return {
            restrict: 'AE',
            replace: true,
            transclude : true,
            scope : {
                hub : '='

            },
            templateUrl: 'pages/directives/device-carousel.html',
            controller : 'DeviceController',
            link: function (scope, element, attr, DeviceController){


            }
        }
    })
    .controller('DeviceCarouselController' , function($rootScope, $scope, $state){


    });