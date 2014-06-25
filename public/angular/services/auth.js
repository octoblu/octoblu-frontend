angular.module('octobluApp')
    .service('AuthService', function ($q, $http, $cookies) {
        var currentUser;

        return {

            login: function (email, password) {
                return $http.post('/api/auth/login', {
                    email: email,
                    password: password
                }).then(function (result) {
                    currentUser = result.data;
                    $http.defaults.headers.skynet_auth_uuid = currentUser.skynetuuid;
                    $http.defaults.headers.skynet_auth_token = currentUser.skynettoken;
                    $cookies.skynetuuid = currentUser.skynetuuid;
                    $cookies.skynettoken = currentUser.skynettoken;
                    return currentUser;
                }, function(err){
                    currentUser = undefined;
                    delete $http.defaults.headers.skynet_auth_uuid;
                    delete $http.defaults.headers.skynet_auth_token;
                    delete $cookies.skynetuuid;
                    delete $cookies.skynettoken;
                });
            },
            getCurrentUser: function () {
                if(currentUser){
                    var defer = $q.defer();
                    defer.resolve(currentUser);
                   return defer.promise;
                } else {

                    return $http.get('/api/auth').then(function(result){
                        currentUser = result.data;
                        $http.defaults.headers.skynet_auth_uuid = currentUser.skynetuuid;
                        $http.defaults.headers.skynet_auth_token = currentUser.skynettoken;
                        $cookies.skynetuuid = currentUser.skynetuuid;
                        $cookies.skynettoken = currentUser.skynettoken;
                        return currentUser;
                    }, function(err){
                        currentUser = undefined;
                        delete $http.defaults.headers.skynet_auth_uuid;
                        delete $http.defaults.headers.skynet_auth_token;
                        delete $cookies.skynetuuid;
                        delete $cookies.skynettoken;
                    });
                }
            }
        }
    });