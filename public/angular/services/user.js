angular.module('e2eApp')
    .service('userService', function ($http) {
        this.getEvents = function(uuid, callback) {
            $http.get('/api/user/' + uuid + '/events')
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });
        };

        this.getUser = function(user, callback) {
            $http.get('/api/user/' + user)
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.saveConnection = function(uuid, name, key, token, custom_tokens, callback) {

            $http.put('/api/user/' + uuid+ '/channel/' + name, {key: key, token: token, custom_tokens: custom_tokens})
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

        this.removeConnection = function(uuid, name, callback) {

            $http.delete('/api/user/' + uuid+ '/channel/' + name, {} )
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };
    });

