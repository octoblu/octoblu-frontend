angular.module('octobluApp')
.service('nodeRedService', function ($http) {

    this.getPort = function(uuid, token, callback) {

        $http.get('/api/redport/' + uuid + '/' + token)
            .success(function(data) {
                callback(JSON.parse(data));

            })
            .error(function(data) {
                console.log('Error: ' + data);
                callback({});
            });

    };

})
