'use strict';

angular.module('octobluApp')
    .controller('SignupController', function($scope, $state, $location,  AuthService) {

        var signupParams = $location.search();
        $scope.errorMsg = '';

        $scope.signupUser = function(){

            if($scope.password !== $scope.password_confirmation){
                $scope.errorMsg = 'Passwords Don\'t Match';
                return;
            }

            AuthService.signup(
                $scope.email,
                $scope.password,
                signupParams.email,
                signupParams.invitation_code
            ).then(function(){
                    $state.go('ob.home');
                }, function(){
                    $scope.errorMsg = 'Error creating user';
                });
        };
    });