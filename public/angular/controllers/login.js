'use strict';

angular.module('e2eApp')

    .controller('loginController', function($scope, $state, $location) {
        var user = $.cookie("skynetuuid");

        // if($location.search().referrer){
        //   $.cookie('redirect', $location.search().referrer);
        // }

        if (user){
            $state.go('dashboard');
        }
    });
