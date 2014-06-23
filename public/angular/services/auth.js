angular.module('octobluApp')
    .service('AuthService', function ($q, $http) {
        return {
            login: function (email, password) {
                return $http.post('/api/auth/login', {
                    email: email,
                    password: password
                }).then(function (result) {
                    return result.data;
                });
            },
            getCurrentUser: function () {
                return $http.get('/api/auth');
            }
        }
    });