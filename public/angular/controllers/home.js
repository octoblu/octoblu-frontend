//'use strict';

angular.module('e2eApp')
    .controller('homeController', function($scope, $location, $anchorScroll, $modal, channelService) {
        $("#main-nav").hide();

        user = $.cookie("skynetuuid");
        if(user != undefined ){
            window.location.href = "/dashboard";
        } else {
            $scope.message = 'Home page content pending.';
        }

        channelService.getList(function(data) {
            $scope.availableChannels = data;
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
            $(document).ready(function () {
                athenaSlide(
                    athenaSlideId = 'slidecontent',
                    athenaPreviousButtonId = 'slide-previous',
                    athenaNextButtonId = 'slide-next',
                    athenaDotButtonClass = 'slide-dot',
                    athenaDotActiveClass = 'slide-active',
                    athenaPlayButtonId = 'slide-play',
                    athenaStopButtonId = 'slide-stop',
                    /**MORE OPTIONS**/
                    athenaSlideMode = 'sliding',
                    athenaSlideTime = 500,
                    athenaSlideDelay = 500,
                    athenaSlideEffect = 'swing',
                    athenaAutoStartLoop = true,
                    athenaLoopTime = 10000
                );
            });
        });

        $scope.watchVideo = function() {
          var modalInstance = $modal.open({
            templateUrl: 'watchVideo.html',
            scope: $scope,
            controller: function ($modalInstance) {
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
          });
        };
   });