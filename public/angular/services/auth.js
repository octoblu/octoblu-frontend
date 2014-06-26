angular.module('octobluApp')
    .service('AuthService', function ($q, $http, $cookies) {
        var currentUser;

        //TODO: move me to the eventual root controller.
        function getProfileUrl(user) {
            /* if (data.local) {
             $(".avatar").html('<img width="23" height="23" src="http://avatars.io/email/' + data.local.email.toString() + '" />');
             $(".user-name").html(data.local.email.toString());
             $scope.user = data.local.email;
             $scope.skynetuuid = data.local.skynetuuid;
             $scope.skynettoken = data.local.skynettoken;
             token = data.local.skynettoken;
             } else if (data.twitter) {
             $(".user-name").html('@' + data.twitter.username.toString());
             $scope.user = data.twitter.displayName;
             $scope.skynetuuid = data.twitter.skynetuuid;
             $scope.skynettoken = data.twitter.skynettoken;
             token = data.twitter.skynettoken;
             } else if (data.facebook) {
             $(".avatar").html('<img width="23" height="23" alt="' + data.facebook.name.toString() + '" src="https://graph.facebook.com/' + data.facebook.id.toString() + '/picture" />');
             $(".user-name").html(data.facebook.name.toString());
             $scope.user = data.facebook.name;
             $scope.skynetuuid = data.facebook.skynetuuid;
             $scope.skynettoken = data.facebook.skynettoken;
             token = data.facebook.skynettoken;
             } else if (data.google) {
             $(".avatar").html('<img width="23" height="23" alt="' + data.google.name.toString() + '" src="https://plus.google.com/s2/photos/profile/' + data.google.id.toString() + '?sz=32" />');
             $(".user-name").html('+' + data.google.name.toString());
             $scope.user = data.google.name;
             $scope.skynetuuid = data.google.skynetuuid;
             $scope.skynettoken = data.google.skynettoken;
             token = data.google.skynettoken;
             } else {
             // $scope.user = data.local.email;
             $scope.skynetuuid = user;
             }*/
            if (user.local) {
                user.avatarUrl = 'http://avatars.io/email/' + user.local.email.toString();
            } else if (data.twitter) {

            } else if (data.facebook) {
                user.avatarUrl = 'https://graph.facebook.com/' + data.facebook.id.toString() + '/picture';
            } else if (data.google) {
                user.avatarUrl = 'https://plus.google.com/s2/photos/profile/' + data.google.id.toString() + '?sz=32';
            }
        }

        function loginHandler(result) {
            currentUser = result.data;
            $http.defaults.headers.skynet_auth_uuid = currentUser.skynetuuid;
            $http.defaults.headers.skynet_auth_token = currentUser.skynettoken;
            $cookies.skynetuuid = currentUser.skynetuuid;
            $cookies.skynettoken = currentUser.skynettoken;
            getProfileUrl(currentUser);
            return currentUser;
        }

        function logoutHandler(err) {
            currentUser = undefined;
            delete $http.defaults.headers.skynet_auth_uuid;
            delete $http.defaults.headers.skynet_auth_token;
            delete $cookies.skynetuuid;
            delete $cookies.skynettoken;
        }

        return {
            login: function (email, password) {
                return $http.post('/api/auth', {
                    email: email,
                    password: password
                }).then(loginHandler, function(err){
                    logoutHandler(err);
                    throw err;
                });
            },

            logout: function () {
                return $http.delete('/api/auth').then(logoutHandler, logoutHandler);
            },

            getCurrentUser: function () {
                if (currentUser) {
                    var defer = $q.defer();
                    defer.resolve(currentUser);
                    return defer.promise;
                } else {
                    return $http.get('/api/auth').then(loginHandler, function(err){
                        logoutHandler(err);
                        throw err;
                    });
                }
            }
        };
    });