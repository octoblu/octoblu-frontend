'use strict';
angular.module('octobluApp')
    .service('AuthService', function ($q, $cookies,  $http, $window, OCTOBLU_API_URL) {
        var service;
        var currentUser = {skynet: {}};
        var currentAuthRequest = null;

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

        function loginHandler(result) {
            currentAuthRequest = null;
            if(_.indexOf([502, 503, 504], result.status) >= 0){
              return result.data;
            }
            if(result.status >= 400){
               throw result.data;
            }
            _.extend(currentUser, result.data);
            getProfileUrl(currentUser);
            return currentUser;
        }

        function logoutHandler(err) {
            currentAuthRequest = null;
            angular.copy({}, currentUser);
            delete $cookies.meshblu_auth_uuid;
            delete $cookies.meshblu_auth_token;
            localStorage.clear();
        }

        return service = {
            acceptTerms: function(){
                return $http.put(OCTOBLU_API_URL + '/api/auth/accept_terms', {accept_terms: true}).then(function(response){
                    if(response && response.status !== 204) {
                        throw response.data;
                    }
                    return service.getCurrentUser(true);
                });
            },

            logout: function () {
                return $http.delete(OCTOBLU_API_URL + '/api/auth').then(logoutHandler, logoutHandler);
            },

            resetToken: function(){
                return $http.post(OCTOBLU_API_URL + '/api/reset-token', {}).then(function(response){
                    if(response.status >= 400){
                        return $q.reject('Could not reset token');
                    }
                    return response.data;
                });
            },

            getCurrentUser: function (force) {
                if (currentAuthRequest != null) {
                    return currentAuthRequest;
                }
                if (! ($cookies.meshblu_auth_uuid && $cookies.meshblu_auth_token)) {
                    return $q.reject("uuid and token not in cookies");
                }
                if (currentUser.id && !force) {
                    return $q.when(currentUser);
                } else {
                    return currentAuthRequest = $http.get(OCTOBLU_API_URL + '/api/auth').then(loginHandler, function (err) {
                        logoutHandler(err);
                        throw err;
                    });
                }
            }
        };
    });
