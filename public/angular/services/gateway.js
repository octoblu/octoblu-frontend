angular.module('e2eApp').
    factory('GatewayService' , function($cookies, $resource){
        return $resource('/api/owner/gateways/:uuid/:token', {'uuid' : $cookies.skynetuuid, 'token' : $cookies.skynettoken },
       { 'available' :
            {
                method: 'GET',
                isArray : true,
                transformResponse : function(data, headers){
                    if(data.gateways){
                        console.log(headers);
                        var allGateways = data.gateways;
                        var availableGateways = _.filter(allGateways, function(gateway){
                            return ! gateway.hasOwnProperty('owner');
                        });
                        return availableGateways;
                    }
                    return [];
                },
                cache : false
            },
          'claimed' :  {
              method : 'GET',
              isArray : true,
              transformResponse : function(data, headers){
                  if(data.gateways){
                      console.log(headers);
                      var allGateways = data.gateways;
                      var claimedGateways = _.filter(allGateways, function(gateway){
                          return gateway.hasOwnProperty('owner') && gateway.owner == $cookies.skynetuuid;
                      });
                      return claimedGateways;
                  }
                  return [];
              }


          }
        });
    });
