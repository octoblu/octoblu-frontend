angular.module('e2eApp').
    factory('GatewayService' , function($cookies, $resource){
        return $resource('/api/owner/gateways/:uuid/:token', {'uuid' : $cookies.skynetuuid, 'token' : $cookies.skynettoken });
    });
