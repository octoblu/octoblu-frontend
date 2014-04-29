var _ = require('lodash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    User = mongoose.model('User'),
    Invitation = mongoose.model('Invitation');



module.exports = function (app) {
    /*
     All Invitations
     Find all the invitations that have been sent or received by the user

     URL - /api/user/:id/:token/invitations
     Parameters
     * id - The users UUID
     * token - The users token
     */
    app.get('/api/user/:id/:token/invitations' , function(req, res){

    });

    /*
       Sent Invitations
       Find all the invitations that have been sent by the user

       URL - /api/user/:id/:token/invitations/sent
       Parameters
       * id - The users UUID
       * token - The users token
     */
    app.get('/api/user/:id/:token/invitations/sent' , function(req, res){

    });

    /*
     Received Invitations
     Find all the invitations that have been sent by the user

     URL - /api/user/:id/:token/invitations/received
     Parameters
     * id - The users UUID
     * token - The users token
     */
    app.get('/api/user/:id/:token/invitations/received' , function(req, res){

    });

    /*
     Find an Invitation with a specific Invitation Id

     URL - /api/user/:id/:token/invitation/:invitationId
     Parameters
     * id - The users UUID
     * token - The users token
     */
    app.get('/api/user/:id/:token/invitation/:invitationId', function(req,res ){

    });

    app.put('/api/user/:id/:token/invitation' , function(req, res){

    });

    app.delete('/api/user/:id/:token/invitations/:invitationId', function(req, res){

    });
}
