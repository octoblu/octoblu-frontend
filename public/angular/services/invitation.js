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


        /**
         * Returns a promise for the list of pending invitations sent and/or received by the user.
         * @param user
         * @param options object with three properties - all, sent and received
         * all - boolean flag indicating whether to get all the invitations sent and received by the user
         * sent - boolean flag indicating whether to only get the invitations sent by the user
         * received - boolean flag indicating whether to only get the invitations received by the user
         *
         * By default if there are no options, we will fetch all invitations.
         */
        this.getInvitations = function (options) {
            var url = '/api/user/:id/:token/invitations';
            if (options) {
                if (options.sent) {
                    url = '/api/user/:id/:token/invitations/sent';
                } else if (options.received) {
                    url = '/api/user/:id/:token/invitations/received';
                }
            }

            return $http.get(url).then(function (result) {
                return result.data
            });
        };
    });
