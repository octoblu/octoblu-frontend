'use strict';

angular.module('e2eApp')
    .directive('deviceCarousel', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope : {
                hub : '=' ,
                selectSubDevice : '&',
                editSubDevice : '&',
                deleteSubDevice : '&'

            },
            controller : 'DeviceCarouselController',
            templateUrl: 'pages/directives/device-carousel.html',
            link: function (scope, element, attr, DeviceCarouselController ) {
//                scope.$watch('hub' , function(newValue){
//                  if(newValue){
//                      $(element).owlCarousel({
//                          items : 2,
////                          lazyLoad : true,
//                          navigation : true
//                      });
//                  }
//                });
            }
        }
    })
    .controller('DeviceCarouselController' , function($rootScope, $scope, $state){

    });