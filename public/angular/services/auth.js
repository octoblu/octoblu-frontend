'use strict';
angular.module('octobluApp')
    .service('AuthService', function ($q, $cookies,  $http, $window, $intercom) {
        var service;
        var currentUser = {skynet: {}};

        //TODO: move me to the eventual root controller.
        function getProfileUrl(user) {
            if (user.local) {
                user.avatarUrl = '//avatars.io/email/' + user.local.email.toString();
            } else if (user.twitter) {

            } else if (user.facebook) {
                user.avatarUrl = 'https://graph.facebook.com/' + user.facebook.id.toString() + '/picture';
            } else if (user.google) {
                user.avatarUrl = 'https://plus.google.com/s2/photos/profile/' + user.google.id.toString() + '?sz=32';
            }
        }

        function setupIntercom(user) {
            var userInfo = {
              email: user.email,
              name: user.name,
              created_at: user.created_at || user.terms_accepted_at,
              user_id: user.skynet.uuid
            };
            $intercom.boot(userInfo); // app_id not required if set in .config() block
            // boot $intercom after you have user data usually after auth success
        }

        function loginHandler(result) {
            if(result.status >= 400){
               throw result.data;
            }
            _.extend(currentUser, result.data);
            getProfileUrl(currentUser);
            setupIntercom(currentUser);
            return currentUser;
        }

        function logoutHandler(err) {
            angular.copy({}, currentUser);
            delete $cookies.skynetuuid;
            delete $cookies.skynettoken;
            $window.location = '/login';
        }

        return service = {
            acceptTerms: function(){
                return $http.put('/api/auth/accept_terms', {accept_terms: true}).then(function(response){
                    if(response && response.status !== 204) {
                        throw response.data;
                    }
                    return service.getCurrentUser(true);
                });
            },
            login: function (email, password) {
                return $http.post('/api/auth', {
                    email: email,
                    password: password
                }).then(loginHandler, function (err) {
                    logoutHandler(err);
                    throw err;
                });
            },

            signup: function (email, password, testerId, invitationCode, sqrtofsaturn) {
                return $http.post('/api/auth/signup', {
                    email: email,
                    password: password,
                    testerId : testerId,
                    invitationCode : invitationCode,
                    sqrtofsaturn : sqrtofsaturn
                }).then(function(result){
                    return loginHandler(result);
                });
            },

            logout: function () {
                return $http.delete('/api/auth').then(logoutHandler, logoutHandler);
            },

            resetPassword: function(email) {
                return $http.post('/api/reset', {email: email}).then(function(response){
                    if(response.status !== 201) {
                        throw response.data;
                    }
                });
            },

            setPassword: function(resetToken, password) {
                return $http.put('/api/reset/'+resetToken, {password: password}).then(function(response){
                    if(response.status !== 204) {
                        throw response.data;
                    }
                });
            },

            updatePassword: function(oldPassword, newPassword) {
                return $http.put('/api/auth/password', {oldPassword: oldPassword, newPassword: newPassword}).then(function(response){
                    if(response.status !== 204) {
                        throw response.data;
                    }
                });
            },

            resetToken: function(){
                return $http.post('/api/reset-token', {}).then(function(response){
                    if(response.status >= 400){
                        return $q.reject('Could not reset token');
                    }
                    return response.data;
                });
            },

            getCurrentUserWithoutRedirect: function () {
                return $q.when(currentUser);
                return $http.get('/api/auth').then(function(result) {
                    return result.data;
                });
            },

            getCurrentUser: function (force) {
                if (currentUser.id && !force) {
                    return $q.when(currentUser);
                } else {
                    return $http.get('/api/auth').then(loginHandler, function (err) {
                        logoutHandler(err);
                        throw err;
                    });
                }
            }
        };
    });
