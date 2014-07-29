'use strict';

angular.module('octobluApp')
    .controller('signupController', function($scope, $state, AuthService) {


        $scope.errorMsg = '';

        $scope.signupUser = function(){

            if($scope.password !== $scope.password_confirmation){
                $scope.errorMsg = 'Passwords Don\'t Match';
                return;
            }

            AuthService.signup(
                $scope.email,
                $scope.password
            ).then(function(){
                    $state.go('ob.home');
                }, function(){
                    $scope.errorMsg = 'Error creating user';
                });
        };
    });