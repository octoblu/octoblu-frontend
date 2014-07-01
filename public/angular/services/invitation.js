angular.module('octobluApp')
    .service('InvitationService', function ($q, $http) {

        /**
         * Sends an invitation to the Operators group an email address
         * @param user - the user sending the invitation
         * @param recipientEmail - email address of the recipient
         */
        this.sendInvitation = function (recipientEmail) {
            return $http.post('/api/user/invitation/send',{ 'email': recipientEmail})
                .then(function (result) {
                    return result.data;
                });
        };

        /**
         * Deletes the invitation from the users list of invitations. The
         * invitation must be sent by the user in order to be deleted.
         *
         * @param invitation
         */
        this.deleteInvitation = function (invitation) {


        };
    });
