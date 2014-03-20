'use strict';

angular.module('e2eApp')
  .controller('analyzerController',function ($scope, $cookies, esFactory) {
    // $rootScope.checkLogin($scope, $http, $injector, true, function () {
      var skynetUUID = $cookies.skynetuuid;
      var skynetToken = $cookies.skynettoken;

      console.log(skynetUUID);
      console.log(skynetToken);

      $scope.search = function(){
        if($scope.search !== undefined ){
          esFactory.search({
              q: $scope.searchText,
              index: '_all'
          }, function (error, response) {
              if(error){
                console.log(error);
              }else {
                $scope.results = response;
            }

          });


        }else{
          //TODO - display a modal error

        }

    }

      // elasticService.search($scope.searchText, function(err, data) {
      //   if(err){
      //     console.log(err);
      //   } else {
      //     console.log('query results', data);
      //     $scope.results = data;
      //   }
      //
      // });

    // });
  });
