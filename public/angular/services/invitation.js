'use strict';
angular.module('octobluApp')
    .service('InvitationService', function ($q, $http) {

        /**
         * Sends an invitation to the Operators group an email address
         * @param user - the user sending the invitation
         * @param recipientEmail - email address of the recipient
         */
        this.requestInvite = function (inviteOptions) {
            return $http.post('/api/invitation/request', inviteOptions)
                .then(function (result) {
                    return result.data;
                });
        };

        this.verifyInvitation = function(invitationCode, email){
          return $http.get('/api/invitation/verify?email=' + email + '&invitationCode='+invitationCode)
            .then(function(result){
              return result.data;
            });

        };
    });
