'use strict';

angular.module('e2eApp')

    .controller('loginController', function($scope, $state, $location) {
        var user = $.cookie("skynetuuid");

        if (user){
            $state.go('dashboard');
        }
    });
