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
              $scope.availableDevices = deviceData;
             $scope.availableChannels = channelData.concat(deviceData);
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
            /* MAIN NAVIGATION
            /*---------------------*/

            $(window).on('scroll', function(){
                if( $(window).width() > 1024 ) {
                    if( $(document).scrollTop() > 150 ) {
                        $('.navbar').addClass('navbar-light');

                    }else {
                        $('.navbar').removeClass('navbar-light');
                    }
                }
            });

            function toggleNavbar() {
                if( ($(window).width() > 1024) && ($(document).scrollTop() <= 150) ) {
                    $(".navbar").removeClass("navbar-light");
                } else {
                    $(".navbar").addClass("navbar-light");
                }
            }

            toggleNavbar();

            $(window).resize( function() {
                toggleNavbar();
            });



            // hide collapsible menu
            $('.navbar-nav li a').click( function() {
                if($(this).parents('.navbar-collapse.collapse').hasClass('in')) {
                    $('#main-nav2').collapse('hide');
                }
            });

            $('#main-nav2').localScroll({
                duration: 1000,
                easing: 'easeInOutExpo'
            });

            $('.hero-buttons').localScroll({
                duration: 1000,
                easing: 'easeInOutExpo'
            });


            /*----------------------/
            /* WORKS
            /*---------------------*/


            var $container = $('.work-item-list');

            new imagesLoaded( $container, function() {
             $container.isotope({
                 itemSelector: '.work-item'
             });
            });

            $(window).smartresize( function() {
             $container.isotope('reLayout');
            });

            $('.work-item-filters a').click( function(e) {

                var selector = $(this).attr('data-filter');
                $container.isotope({
                 filter: selector
                });

                $('.work-item-filters a').removeClass('active');
                $(this).addClass('active');

                return false;
            });            

            /*----------------------/
            /* TESTIMONIAL
            /*---------------------*/

            $('.flexslider').flexslider({
                slideshowSpeed: 4000,
                directionNav: false,
                pauseOnAction: false
            });

            /*----------------------/
            /* TWITTER STREAM
            /*---------------------*/

            /*
            * ### HOW TO CREATE A VALID ID TO USE: ###
            * Go to www.twitter.com and sign in as normal, go to your settings page.
            * Go to "Widgets" on the left hand side.
            * Create a new widget for what you need eg "user timeline" or "search" etc.
            * Feel free to check "exclude replies" if you dont want replies in results.
            * Now go back to settings page, and then go back to widgets page, you should
            * see the widget you just created. Click edit.
            * Now look at the URL in your web browser, you will see a long number like this:
            * 345735908357048478
            * Use this as your ID below instead!
            */
            /**
            * How to use fetch function:
            * @param {string} Your Twitter widget ID.
            * @param {string} The ID of the DOM element you want to write results to.
            * @param {int} Optional - the maximum number of tweets you want returned. Must
            *     be a number between 1 and 20.
            * @param {boolean} Optional - set true if you want urls and hashtags to be hyperlinked!
            * @param {boolean} Optional - Set false if you dont want user photo /
            *     name for tweet to show.
            * @param {boolean} Optional - Set false if you dont want time of tweet
            *     to show.
            * @param {function/string} Optional - A function you can specify to format
            *     tweet date/time however you like. This function takes a JavaScript date
            *     as a parameter and returns a String representation of that date.
            *     Alternatively you may specify the string 'default' to leave it with
            *     Twitter's default renderings.
            */

            twitterFetcher.fetch( '474676149037965312', 'tweet', 1, true, false, true, 'default');

            /*----------------------/
            /* SCROLL TO TOP
            /*---------------------*/

            if( $(window).width() > 992 ) {
                $(window).scroll( function() {
                    if( $(this).scrollTop() > 300 ) {
                        $('.back-to-top').fadeIn();
                    } else {
                        $('.back-to-top').fadeOut();
                    }
                });

                $('.back-to-top').click( function(e) {
                    e.preventDefault();

                    $('body, html').animate({
                        scrollTop: 0,
                    }, 800, 'easeInOutExpo');
                });
            }




            var originalTitle, currentItem;

            $('.media-popup').magnificPopup({
                type: 'image',
                callbacks: {
                    beforeOpen: function() {

                        // modify item title to include description
                        currentItem = $(this.items)[this.index];
                        originalTitle = currentItem.title;
                        currentItem.title = '<h3>' + originalTitle + '</h3>' + '<p>' + $(currentItem).parents('.work-item').find('img').attr('alt') + '</p>';

                        // adding animation
                        this.st.mainClass = 'mfp-fade';
                    },
                    close: function() {
                        currentItem.title = originalTitle;
                    },
                }

            });

            /*----------------------/
            /* CALL TO ACTION
            /*---------------------*/

            if( $(window).width() > 1024 ) {
                wow = new WOW({
                    animateClass: 'animated'
                });

                wow.init();
            } else {
                $('.wow').attr('class', '');
            }

            /*----------------------/
            /* TOOLTIP
            /*---------------------*/

            if( $(window).width() > 1024 ) {
                $('body').tooltip({
                    selector: "[data-toggle=tooltip]",
                    container: "body"
                });
            }

            // init scrollspy except on Opera, it doesn't work because body has 100% height
            if ( !navigator.userAgent.match("Opera/") ) {
                $('body').scrollspy({
                    target: '#main-nav2'
                });
            }else {
                $('#main-nav2 .nav li').removeClass('active');
            }


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
