var _ = require('lodash'),
    moment = require('moment'),
    jade = require('jade'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    nodemailer = require('nodemailer'),
    Invitation = require('../models/invitation'),
    User = require('../models/user'),
    Group = require('../models/group'),
    isAuthenticated = require('./middleware/security').isAuthenticated;
/*
 File : invitation.js
 provides the REST API for finding, creating, deleting, sending and receiving invitations to Groups from Octoblu
 users
 */


var invitationController = {
    findInvitations: function (req, res, searchParams) {
        var user = req.user;
        //build the search query for invitations. Check to see if we want to
        //check for sent or received invitations.
        var queryParams = {};
        if (searchParams.sent) {
            queryParams.from = user.skynet.uuid;
        }

        if (searchParams.received) {
            queryParams.$or = [];
            queryParams.push({
                'recipient.uuid': user.skynet.uuid
            });
            queryParams.push({
                'recipient.email': user.email
            });
        }

        Invitation.find(queryParams)
            .then(function (invitations) {
                return res.json(invitations);
            }, function (err) {
                return res.json(500, [err]);
            });
    },
    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    getAllInvitations: function (req, res) {
        var searchParams = {
            sent: true,
            received: true
        };
        this.findInvitations(req, res, searchParams)
    },

    getInvitationsSent: function (req, res) {
        this.findInvitations(req, res, {sent: true});
    },

    getInvitationsReceived: function (req, res) {
        this.findInvitations(req, res, {received: true});
    },

    getInvitationById: function (req, res) {
        Invitation.findById(req.params.invitationId)
            .then(function (invitation) {
                res.send(invitation);
            },
            function (err) {
                res.send(500, err);
            }
        )
    },

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    sendInvitation: function (req, res) {
        var config = invitationController.config, sender = req.user, recipient, email = req.body.email;
        //1. Check if the recipient is already an existing octoblu user
        //2. Create a new invitation
        //3. Generate an HTML template for the invitation
        //4. send an outgoing email to the recipient email  with the HTML template generated in the previous step
        //and return the invitation to the user.

        return User.findByEmail(email)
            .then(function (rcp) {
                recipient = rcp;
                var inviteData = {
                    recipient: {email: email},
                    from: req.user.skynet.uuid,
                    status: 'PENDING',
                    sent: moment.utc()
                }

                if (rcp) {
                    inviteData.recipient.uuid = recipient.skynet.uuid;
                }

                return Invitation.insert(inviteData);

            }, function (err) {
                console.error(err);
            })
            .then(function (invites) {
            		var invite = _.first(invites);

                var invitationTemplatePath = process.cwd() + config.email.invitation.templateUrl;
                var invitationUrl = req.protocol + "://" + req.header('host') + '/api/invitation/' + invite._id + '/accept';
                var options = {
                    pretty: true,
                    sender: sender,
                    invitationUrl: invitationUrl
                };
                var messageHtml = jade.renderFile(invitationTemplatePath, options);

                var smtpTransport = nodemailer.createTransport("SMTP", {
                    service: "Gmail",
                    auth: {
                        user: config.email.SMTP.Gmail.user,
                        pass: config.email.SMTP.Gmail.password
                    }
                });

                var mailOptions = {
                    to: invite.recipient.email,
                    subject: 'Invitation to share devices on Octoblu from ' + sender.displayName,
                    html: messageHtml
                };

                smtpTransport.sendMail(mailOptions, function (error) {
                    if (error) {
                        res.json(400, {'error': 'Invitation email could not be sent'});
                    }
                    res.send(200, invite);
                });
            }, function (error) {
                res.json(500, {
                    'error': error
                });
            });
    },

    acceptInvitation: function (req, res) {
        var invitation, sender, recipient;
        Invitation.findById(req.params.id)
            .then(function (inv) {
                invitation = inv;

                if (invitation.status === 'ACCEPTED') {
                    return res.redirect('/home');
                }

                return User.findBySkynetUUID(invitation.from)
                    .then(function (snd) {
                        sender = snd;
                        if (invitation.recipient.uuid) {
                            return User.findBySkynetUUID(invitation.recipient.uuid);
                        }
                        return User.findByEmail(invitation.recipient.email);
                    })
                    .then(function (rcp) {
                        recipient = rcp;
                        if (!recipient || recipient.skynet.uuid !== req.user.skynet.uuid) {
                            return res.redirect('/login');
                        }
                        return Group.findOne({'type': 'operators', 'resource.owner.uuid': sender.resource.uuid })
                            .then(function (operatorGroup) {
                                operatorGroup = operatorGroup ||
                                    new Group({
                                        name: 'operators',
                                        'type': 'operators',
                                        resource: {
                                            owner: recipient.resourceId
                                        }
                                    });

                                var existingMember = _.findWhere(operatorGroup.members, {'uuid': recipient.resource.uuid });

                                invitation.accepted = moment.utc();
                                invitation.status = "ACCEPTED";
                                Invitation.update({_id: invitation._id}, invitation);

                                if (!existingMember) {
                                    operatorGroup.members.push(recipient.resourceId);
                                    Group.update({_id: operatorGroup._id}, operatorGroup);
                                }

                                res.redirect('/home');
                            });
                    });
            })
            .then(null, function(err){
                console.error(err);
            });
    },

    deleteInvitation: function (req, res) {
        Invitation.findByIdAndRemove(req.params.invitationId, function (err, invitation) {
            if (err) {
                res.json(500, err);
            }
            res.json(200, invitation);
        });
    }
};

module.exports = function (app, passport, config) {

    //set the configuration for the controller
    invitationController.config = config;
    app.get('/api/user/invitations', isAuthenticated, invitationController.getAllInvitations);
    app.get('/api/user/invitations/sent', isAuthenticated, invitationController.getInvitationsSent);
    app.get('/api/user/invitations/received', isAuthenticated, invitationController.getInvitationsReceived);
    app.get('/api/user/invitation/:invitationId', isAuthenticated, invitationController.getInvitationById);
    app.post('/api/user/invitation/send', isAuthenticated, invitationController.sendInvitation);
    app.get('/api/invitation/:id/accept', invitationController.acceptInvitation);
    app.delete('/api/invitations/:invitationId', isAuthenticated, invitationController.deleteInvitation);
};
