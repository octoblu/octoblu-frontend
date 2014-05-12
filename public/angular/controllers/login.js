'use strict';

angular.module('octobluApp')

    .controller('loginController', function($scope, $state, $location) {
        var user = $.cookie("skynetuuid");

        if (user){
            $state.go('dashboard');
        }
    });
