/*
  File : invitation.js
  provides the REST API for finding, creating, deleting, sending and receiving invitations to Groups from Octoblu
  users
 */
var _ = require('lodash'),
    moment = require('moment'),
    jade = require('jade'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    InvitationSchema = require('../models/invitation'),
    GroupSchema = require('../models/group'),
    Group = mongoose.model('Group', GroupSchema),
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
                    queryParams.from = user.skynetuuid;
                }

                if(searchParams.received){
                    var email = user.local.email || user.google.email || user.facebook.email;
                    queryParams.$or = [];
                    queryParams.push({
                      'recipient.uuid' : user.skynetuuid
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

           //1. Find the user with the give UUID and Token
           //2. Check if the recipient is already an existing octoblu user
           //3. Create a new invitation
           //4. Generate an HTML template for the invitation
           //5. send an outgoing email to the recipient email  with the HTML template generated in the previous step
           //and return the invitation to the user.
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
                     }).exec()
                 }
                 })
               .then(function(users){

                  var sender = users.sender;
                  var recipient = users.recipient;
                  var inviteData = {};
                   inviteData.recipient = {};
                   inviteData.recipient.email = email;
                   inviteData.from = uuid;
                   inviteData.status = 'PENDING';
                   inviteData.sent = moment.utc();

                  if(recipient){
                      inviteData.recipient.uuid = recipient.skynetuuid;
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

                   var invitationTemplatePath = process.cwd() + config.email.invitation.templateUrl;
                   var invitationUrl = req.protocol + "://" + req.header('host') + '/invitation/' + invite.invitation._id + '/accept';
                   var options = {
                       pretty : true,
                       sender : invite.sender,
                       invitationUrl : invitationUrl
                   };
                   invite.messageHtml = jade.renderFile( invitationTemplatePath ,options );
                   return invite;
               })
               .then(function( outboundMessage ) {

                   var smtpTransport = nodemailer.createTransport("SMTP",{
                       service: "Gmail",
                       auth: {
                           user: config.email.SMTP.Gmail.username,
                           pass: config.email.SMTP.Gmail.password
                       }
                   });

                   var mailOptions = {
                       from : 'Octoblu <' + config.email.SMTP.Gmail.username + '>',
                       to: outboundMessage.invitation.recipient.email,
                       subject : 'Invitation to share devices on Octoblu from ' + outboundMessage.sender.name,
                       html : outboundMessage.messageHtml
                   };

                   smtpTransport.sendMail(mailOptions, function(error){
                       if(error){
                          reject(error);
                       }
                       res.send(200, outboundMessage.invitation );
                   });
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
    acceptInvitation : function (req, res, next){

     var invitePromise = Invitation.findById(req.params.id).exec();
     invitePromise.then(function(invitation){
        var user = User.findOne({ $or: [
            {
                'local.skynetuuid' : invitation.from
            },
            {
                'twitter.skynetuuid' : invitation.from
            },
            {
                'facebook.skynetuuid' :  invitation.from
            },
            {
                'google.skynetuuid' : invitation.from
            }
        ]
        }).exec();
        return { 'invitation' : invitation, 'user' : user};
     })
     .then(function(result){

         var sender = result.user;
         var recipient = req.user;
         var invitation = result.invitation;

         var operatorGroupIndex = _.findIndex(sender.groups, {'type' : 'Operators'});
         //The user does not have an invitation group, create one
         if(operatorGroupIndex < 0){
             var operatorGroup = new Group({
                 'uuid' : uuid.v1(),
                 'type' : 'Operators',
                 'members' : [recipient.skynetuuid]
             });
             sender.push(operatorGroup);
         } else {
            /*
              Check if the recipient is already a member of the group, if they are then
             */
            var operatorGroup = sender.groups[operatorGroupIndex];
             var isNotGroupMember = _.findIndex(operatorGroup.members, recipient.skynetuuid ) < 0;

             if( isNotGroupMember ){
                operatorGroup.members.push(recipient.skynetuuid);
             }
         }
        //Update the senders User info with new group details
        sender.save(function(err, sender){
            if(err){
                reject(error);
            }
        });

        invitation.completed = moment.utc();
        //Update the completed datetime on the invitation and save it.
        invitation.save(function(err){
            if(err){
                reject(err);
            }
        });
        return invitation;
     })
     .then(function(invitation){
             next();
     }, function(error){
         next(error);
     });
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

module.exports = function (app, passport, config) {

    //set the configuration for the controller
    invitationController.config = config;
    app.get('/api/user/:id/:token/invitations' , passport.authorize('local-login'), invitationController.getAllInvitations );
    app.get('/api/user/:id/:token/invitations/sent' , passport.authorize('local-login'), invitationController.getInvitationsSent );
    app.get('/api/user/:id/:token/invitations/received' , passport.authorize('local-login'), invitationController.getInvitationsReceived );
    app.get('/api/user/:id/:token/invitation/:invitationId', passport.authorize('local-login'), invitationController.getInvitationById );
    app.put('/api/user/:id/:token/invitation/send', invitationController.sendInvitation);
    app.delete('/api/user/:id/:token/invitations/:invitationId', passport.authorize('local-login'), invitationController.deleteInvitation );
    app.get('/api/invitation/:id/accept', passport.authorize('local-login'), invitationController.acceptInvitation, function(err,  req, res){
        if(err){
            console.log(err);
        }
        res.redirect('/dashboard')

    } );
};
