/*
  File : invitation.js
  provides the REST API for finding, creating, deleting, sending and receiving invitations to Groups from Octoblu
  users
 */
var _ = require('lodash'),
    moment = require('moment'),
    jade = require('jade'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    InvitationSchema = require('../models/invitation'),
    User = mongoose.model('User'),
    Invitation = mongoose.model('Invitation', InvitationSchema);


var invitationController = {
    /**
     *
     * @param req
     * @param res
     * @param searchParams
     * @returns {*}
     */
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
    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    getAllInvitations : function(req, res){
        var searchParams = {
            sent : true,
            received : true
        };
        return this.findInvitations(req, res, searchParams )

    },
    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    getInvitationsSent : function(req, res){
        var searchParams = {
            sent : true
        };
        return this.findInvitations(req, res, searchParams );
    },

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    getInvitationsReceived : function(req, res){
        var searchParams = {
            received : true
        };
        return this.findInvitations(req, res, searchParams );
    },

    /**
     *
     * @param req
     * @param res
     * @returns {*}
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

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    sendInvitation : function(req, res ){

        if( req.params.id && req.params.token ){

            var uuid = req.params.id;
            var token = req.params.token;
            var email = req.body.email;
            var config = this.config;

           var userPromise =  User.findOne({ $or: [
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
            }).exec();

           userPromise
               .then(function(user){

                 return {
                     sender: user,
                     recipient: User.findOne({
                         $or: [
                             { 'local.email': email },
                             {'google.email': email },
                             {'facebook.email': email }
                         ]
                     }).exec().fulfill()
                 }
                 })
               .then(function(users){
                  var sender = users.sender;
                  var recipient = users.recipient;
                  var inviteData = {};
                   inviteData.recipient = {};
                   inviteData.recipient.email = email;
                   inviteData.from = uuid;
                  if(recipient){
                      var recipient_uuid = recipient.local.skynetuuid || recipient.google.skynetuuid || recipient.facebook.skynetuuid || recipient.twitter.skynetuuid;
                      inviteData.recipient.uuid = recipient_uuid;
                  }
                  var invitation = new Invitation(inviteData);
                  invitation.save();
                  return {
                      sender : sender,
                      recipient : recipient,
                      invitation : invitation
                  };
               })
               .then(function ( invite ){
                   /*
                      Generate the e-mail template and return the
                      results along with sender and invitation for outgoing message.

                    */

               })
               .then(function( outgoingMessage ){


               },function(error){
                   return  res.json(500, {
                       'success' : false,
                       'error' : error
                   });
               });


        } else {
            return res.json(400, {
                error : 'One or more required parameters is missing'
            });
        }
    },

    /**
     *
     * @param req
     * @param res
     */
    acceptInvitation : function (req, res){

    },

    /**
     *
     * @param req
     * @param res
     */
    deleteInvitation : function(req, res){
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
                    Invitation.findByIdAndRemove(invitationId , function(err, invitation ){
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

    }
};

module.exports = function (app, config) {

    //set the configuration for the controller
    invitationController.config = config;
    app.get('/api/user/:id/:token/invitations' , invitationController.getAllInvitations );
    app.get('/api/user/:id/:token/invitations/sent' ,  invitationController.getInvitationsSent );
    app.get('/api/user/:id/:token/invitations/received' , invitationController.getInvitationsReceived );
    app.get('/api/user/:id/:token/invitation/:invitationId', invitationController.getInvitationById );
    app.put('/api/user/:id/:token/invitation/send' , invitationController.sendInvitation);
    app.delete('/api/user/:id/:token/invitations/:invitationId', invitationController.deleteInvitation );
    app.get('/api/user/invitation/:invitationId/accept', invitationController.acceptInvitation );
};
