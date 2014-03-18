angular.module('e2eApp')
    .controller('DeviceController', function ($rootScope, $scope, $state,  $http, $cookies, userService, ownerService ) {
        var ownerId = $cookies.skynetuuid;
        var token = $cookies.skynettoken;
        //check if they are authenticated, if they arent signed in route them to login
        //TODO this will be handled by route checking at the root scope level. Should be changed then.
        if( ownerId === undefined || token === undefined ){
             $state.go('login');
        }

      $scope.gateways = [];

      $scope.addNewHub = function(){

      };



    } )
    .controller('DeviceWizardController', function ($rootScope, $scope, $http, $stateParams, ownerService  )
    {

})
    .controller('SubDeviceController',  function ($rootScope, $scope, $http, $injector, ownerService )
    {

    });
