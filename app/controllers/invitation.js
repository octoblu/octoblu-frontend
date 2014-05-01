/*
  File : invitation.js
  provides the REST API for create, read, update and delete  operations for invitations sent by the User.

  TODO - Create function for finding User info and return the
 */
var _ = require('lodash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Invitation = mongoose.model('Invitation');


var invitationController = {


    findInvitations : function(req, res, searchParams ){
        if(req.params.id && req.params.token ) {

            var uuid = req.params.id;
            var token = req.params.token;

            User.findOne({ $or: [
                {
                    'local.skynetuuid': uuid,
                    'local.skynettoken': token
                },
                {
                    'twitter.skynetuuid': uuid,
                    'twitter.skynettoken': token
                },
                {
                    'facebook.skynetuuid': uuid,
                    'facebook.skynettoken': token
                },
                {
                    'google.skynetuuid': uuid,
                    'google.skynettoken': token
                }
            ]
            },  function(err, user){
                if(err){
                 return res.json(500, [err])
                }
                //build the search query for invitations. Check to see if we want to
                //check for sent or received invitations.
                var queryParams = {};
                if(searchParams.sent){
                    queryParams.from = user.uuid;
                }

                if(searchParams.received){
                    var email = user.local.email || user.google.email || user.facebook.email;
                    queryParams.$or = [];
                    queryParams.push({
                      'recipient.uuid' : user.uuid
                    });
                    queryParams.push({
                        'recipient.email' : email
                    });
                }

                Invitation.find(queryParams,  function(err, invitations ){
                        if(err){
                            return res.json(500 , [err]);
                        }
                        return res.json(200, invitations );
                });
            });

        } else {
           return res.json(400, [{
               error : 'one or more required parameters is missing'
           }]);
        }

    },
    /*
     All Invitations
     VERB - GET
     Find all the invitations that have been sent or received by the user
     URL - /api/user/:id/:token/invitations
     Parameters
     * id - The users UUID
     * token - The users token
     */
    getAllInvitations : function(req, res){
        var searchParams = {
            sent : true,
            received : true
        };
        return this.findInvitations(req, res, searchParams )

    },

    /*
     Sent Invitations
     Find all the invitations that have been sent by the user
     VERB - GET
     URL - /api/user/:id/:token/invitations/sent
     Parameters
     * id - The users UUID
     * token - The users token
     */
    getInvitationsSent : function(req, res){
        var searchParams = {
            sent : true
        };
        return this.findInvitations(req, res, searchParams );
    },

    /*
     Received Invitations
     Find all the invitations that have been sent by the user
     VERB GET
     URL - /api/user/:id/:token/invitations/received
     Parameters
     * id - The users UUID
     * token - The users token
     */
    getInvitationsReceived : function(req, res){
        var searchParams = {
            received : true
        };
        return this.findInvitations(req, res, searchParams );
    },

    /*
     Find an Invitation with a specific Invitation Id
     VERB GET
     URL - /api/user/:id/:token/invitation/:invitationId
     Parameters
     * id - The users UUID
     * token - The users token
     */
    getInvitationById : function(req, res){
        if( req.params.id && req.params.token && req.params.invitationId ){

            var uuid = req.params.id;
            var token = req.params.token;
            var invitationId = req.params.invitationId;
            User.findOne({ $or: [
                {
                    'local.skynetuuid' : uuid,
                    'local.skynettoken' : token
                },
                {
                    'twitter.skynetuuid' : uuid,
                    'twitter.skynettoken' : token
                },
                {
                    'facebook.skynetuuid' : uuid,
                    'facebook.skynettoken' : token
                },
                {
                    'google.skynetuuid' : uuid,
                    'google.skynettoken' : token
                }
            ]
            }, function(err, user) {
                if(!err) {
                    return res.JSON(404, err);
                } else {
                    Invitation.findById(invitationId , function(err, invitation ){
                        if( err ){
                            res.json(500, err);
                        }
                        res.json(200, invitation );
                    } );
                }
            });
        } else {
            return res.json(400, {
                error : 'One or more required parameters is missing'
            });
        }

    },

    /*
     send a new invitation
     VERB - PUT
     URL - /api/user/:id/:token/invitation/
     Parameters
     * id - The users UUID
     * token - The users token
     */
    sendInvitation : function(req, res){


    },

    /*
     delete an invitation
     VERB - DELETE
     URL - /api/user/:id/:token/invitation/:invitationId
     Parameters
     * id - The users UUID
     * token - The users token
     */
    deleteInvitation : function(req, res){

    }
};

module.exports = function (app) {
    app.get('/api/user/:id/:token/invitations' , invitationController.getAllInvitations );
    app.get('/api/user/:id/:token/invitations/sent' ,  invitationController.getInvitationsSent );
    app.get('/api/user/:id/:token/invitations/received' , invitationController.getInvitationsReceived );
    app.get('/api/user/:id/:token/invitation/:invitationId', invitationController.getInvitationById );
    app.put('/api/user/:id/:token/invitation' , invitationController.sendInvitation );
    app.delete('/api/user/:id/:token/invitations/:invitationId', invitationController.deleteInvitation );
};
