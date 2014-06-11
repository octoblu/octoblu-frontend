//'use strict';

angular.module('octobluApp')
    .controller('homeController', function($rootScope,  $scope, $cookies,  $http, $injector, $state, $location, $anchorScroll, $modal, channelService) {
        var user = $cookies.skynetuuid;

        if (user != undefined) {
            $state.go('dashboard');
        } else {
            $scope.message = 'Home page content pending.';
        }

        // $scope.availableChannels = channelsAndDevices;

       channelService.getList(function(channelData) {
         channelService.getSmartDevicesHomePage(function(error, deviceData) {
             if(error){
                 console.log('error: ' + error);
             }
//              $scope.availableChannels = channelData;
              $scope.availableDevices = deviceData;
             $scope.availableChannels = channelData.concat(deviceData);
             console.log('CHANNELS->',$scope.availableChannels)
         });
       });

        $scope.gotoApis = function (){
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('apis');

            // call $anchorScroll()
            $anchorScroll();
        };

        $(document).ready(function () {
            /*SLIDE*/
            // athenaSlide(
            //     athenaSlideId = 'slidecontent',
            //     athenaPreviousButtonId = 'slide-previous',
            //     athenaNextButtonId = 'slide-next',
            //     athenaDotButtonClass = 'slide-dot',
            //     athenaDotActiveClass = 'slide-active',
            //     athenaPlayButtonId = 'slide-play',
            //     athenaStopButtonId = 'slide-stop',
            //     /**MORE OPTIONS**/
            //     athenaSlideMode = 'sliding',
            //     athenaSlideTime = 500,
            //     athenaSlideDelay = 500,
            //     athenaSlideEffect = 'swing',
            //     athenaAutoStartLoop = true,
            //     athenaLoopTime = 10000
            // );

            /*-----------------------------/
            /* HERO UNIT FULLSCREEN VIDEO
            /*---------------------------*/
            if( $('.hero-video').length > 0 ) {
                var videoOptions = {
                    // mp4: '/assets/videos/motion.mp4',
                    // webm: '/assets/videos/motion.webm',
                    // ogv: '/assets/videos/motion.ogv',
                    mp4: 'assets/videos/skynetplayground.mp4',
                    webm: 'assets/videos/skynetplayground.webm',
                    ogv: 'assets/videos/skynetplayground.ogg',
                    opacity: 1,
                    zIndex: 0,
                    fullscreen: true,
                    muted: 'muted'
                }

                // iPhone seems provide video accesibility, so don't give poster to show the video
                if( $(window).width() > 480 ) {
                    videoOptions.poster = '/assets/images/sliders/slider3.png';
                }

                $('.hero-unit').videoBG(videoOptions);

                $('.videoBG_wrapper').width('100%');
                $('.videoBG_wrapper').height('100%');

                $('#video-buttons').localScroll();
                $('#top-button').localScroll();
                $('#brand').localScroll();


                // resize the wrapper as the video resized
                $(window).resize( function() {
                    $('.videoBG_wrapper').width('100%');
                    $('.videoBG_wrapper').height('100%');
                });

                // video volume control
                $('.fa-volume-up, .fa-volume-off').click( function() {
                        $('.videoBG video').toggleVolume();
                        $(this).toggleClass("fa-volume-up fa-volume-off");
                    }
                );

                $.fn.toggleVolume = function() {
                    var domVideo = $(this).get(0);

                    if( domVideo.muted == true ) {
                        domVideo.muted = false;
                    }else {
                        domVideo.muted = true;
                    }
                }
            }

            /*----------------------/
            /* TESTIMONIAL
            /*---------------------*/

            $('.flexslider').flexslider({
                slideshowSpeed: 4000,
                directionNav: false,
                pauseOnAction: false
            });



        });

        // $scope.watchVideo = function() {
        //   var modalInstance = $modal.open({
        //     templateUrl: 'watchVideo.html',
        //     scope: $scope,
        //     controller: function ($modalInstance) {
        //         $scope.cancel = function () {
        //             $modalInstance.dismiss('cancel');
        //         };
        //     }
        //   });
        // };
   });
