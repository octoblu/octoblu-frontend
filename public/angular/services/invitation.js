angular.module('octobluApp')
    .service('InvitationService' , function($q, $http ){

        /**
         * Sends an invitation to the Operators group an email address
         * @param user - the user sending the invitation
         * @param recipient - email address of the recipient
         */
        this.sendInvitation = function(user, recipientEmail ){
            var deferredInvitation = $q.defer();
            $http.put('/api/user/:id/:token/invitation/send',
                {
                    'email' : recipientEmail
                },
                {
                    params : {
                        'uuid' : user.uuid,
                        'token' : user.token
                    },
                    cache : false
                }
            ).success(function(invitation){
                    deferredInvitation.resolve( invitation );
            }).error(function(error){
                    deferredInvitation.reject( error );
            });

            return deferredInvitation.promise;
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
         * Returns a promise for the list of pending invitations sent and/or received by the user.
         * @param user
         * @param options object with three properties - all, sent and received
         * all - boolean flag indicating whether to get all the invitations sent and received by the user
         * sent - boolean flag indicating whether to only get the invitations sent by the user
         * received - boolean flag indicating whether to only get the invitations received by the user
         *
         * By default if there are no options, we will fetch all invitations.
         */
        this.getInvitations = function( user, options ){

            var url = '/api/user/:id/:token/invitations';
            if( options ){
                if(options.sent ){
                    url =  '/api/user/:id/:token/invitations/sent';
                } else if (options.received ){
                    url ='/api/user/:id/:token/invitations/received';
                }
            }

            var deferred = $q.defer();

            $http.get(url, { params : { 'uuid' : user.uuid, 'token' : user.token },
                            cache : false
            }).success(function( invitations ){
                deferred.resolve(invitations);

            }).error(function(error){
                deferred.reject(error);
            });

            return deferred.promise;
        };




    });
