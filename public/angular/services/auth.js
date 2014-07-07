angular.module('octobluApp')
    .service('AuthService', function ($q, $cookies,  $http) {
        var currentUser;

        //TODO: move me to the eventual root controller.
        function getProfileUrl(user) {

            if (user.local) {
                user.avatarUrl = 'http://avatars.io/email/' + user.local.email.toString();
            } else if (user.twitter) {

            } else if (user.facebook) {
                user.avatarUrl = 'https://graph.facebook.com/' + user.facebook.id.toString() + '/picture';
            } else if (user.google) {
                user.avatarUrl = 'https://plus.google.com/s2/photos/profile/' + user.google.id.toString() + '?sz=32';
            }
        }

        function loginHandler(result) {
            currentUser = result.data;
            $cookies.skynetuuid = currentUser.skynetuuid;
            $cookies.skynettoken = currentUser.skynettoken;
            getProfileUrl(currentUser);
            return currentUser;
        }

        function logoutHandler(err) {
            currentUser = undefined;
            delete $cookies.skynetuuid;
            delete $cookies.skynettoken;
        }

        return {
            login: function (email, password) {
                return $http.post('/api/auth', {
                    email: email,
                    password: password
                }).then(loginHandler, function (err) {
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
                    return $http.get('/api/auth').then(loginHandler, function (err) {
                        logoutHandler(err);
                        throw err;
                    });
                }
            }
        };
    });