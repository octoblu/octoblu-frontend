'use strict';

angular.module('e2eApp')
    .controller('loginController', function($scope, $state) {
        var user = $.cookie("skynetuuid");

        if (!!user){
            $state.go('dashboard');
        }
    });