/*
  File : invitation.js
  provides the REST API for create, read, update and delete  operations for invitations sent by the User.
 */
var _ = require('lodash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    User = mongoose.model('User'),
    Invitation = mongoose.model('Invitation');


var invitationController = {

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
