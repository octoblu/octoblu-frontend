'use strict';
angular.module('octobluApp')
    .controller('acceptTermsController', function ($scope, $state, AuthService) {
        $scope.acceptTerms = function(){
          AuthService.acceptTerms().then(function(){
            $state.go('material.design');
          });
        };
    });
