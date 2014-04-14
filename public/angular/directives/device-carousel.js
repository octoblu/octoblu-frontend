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

'use strict';

//angular.module('partyfindApp')
//    .directive('mapCarousel', function ($timeout) {
//        return {
//            restrict: 'E',
//            replace: true,
//            scope: {
//                ngModel: '='
//            },
//            template:
//                '<div class="owl-carousel owl-theme"></div>',
//            link: function (scope, element, attrs) {
//                scope.$watch('ngModel', function (current, old) {
//                    if (!scope.owl) {
//                        scope.owl = $(element);
//
//                        scope.owl.owlCarousel({
//                            pagination: false,
//                            navigation: false,
//                            autoHeight : true
//                        });
//                    }
//
//                    _.each(scope.owl.data('owlCarousel').$userItems, function () {
//                        scope.owl.data('owlCarousel').removeItem();
//                    });
//
//                    _.each(scope.ngModel, function (model) {
//                        scope.owl.data('owlCarousel').addItem(
//                                '<div class="item">' +
//                                '   <a href="' + model.data.link + '" target="_blank">' +
//                                '       <img src="' + model.data.images.low_resolution.url + '">' +
//                                '   </a>' +
//                                '   <span class="caption">' +
//                                '   <a href="' + model.data.link + '" target="_blank">' +
//                                '       ' + model.data.user.username + ' @ ' + moment(model.created).format('LT') +
//                                '   </a><br />' +
//                                '       ' + model.data.caption.text +
//                                '   </span>' +
//                                '</div>'
//                        );
//                    });
//                }, true);
//            }
//        };
//    });