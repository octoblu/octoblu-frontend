angular.module('octobluApp')
    .service('InvitationService' , function($q, $resource ){

        /**
         * Sends an invitation to the Operators group an email address
         * @param user - the user sending the invitation
         * @param recipient - email address of the recipient
         */
        this.sendInvitation = function(user, recipient ){

        };

        /**
         * Deletes the invitation from the users list of invitations. The
         * invitation must be sent by the user in order to be deleted.
         *
         * @param invitation
         */
        this.deleteInvitation = function( invitation ){

        };


        /**
         * Returns the list of pending invitations sent and/or received by the user.
         * @param user
         * @param options object with three properties - all, sent and received
         * all - boolean flag indicating whether to get all the invitations sent and received by the user
         * sent - boolean flag indicating whether to only get the invitations sent by the user
         * received - boolean flag indicating whether to only get the invitations received by the user
         *
         * By default if there are no options, we will fetch sent invitations.
         */
        this.getInvitations = function( user, options ){

        };




    });
