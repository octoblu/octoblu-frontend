'use strict';

angular.module('e2eApp')
    .controller('loginController', function($scope, $http) {
        console.log('login');
        user = $.cookie("skynetuuid");
        console.log(user);
        if (user != undefined){
            window.location.href = "/dashboard";
        }
    });