angular.module('e2eApp')
.service('nodeRedService', function ($http) {

    this.getPort = function(uuid, token, callback) {

        $http.get('/api/redport/' + uuid + '/' + token)
            .success(function(data) {
                callback(data);

            })
            .error(function(data) {
                console.log('Error: ' + data);
                callback({});
            });

    };

})
