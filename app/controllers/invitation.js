var _ = require('lodash'),
    moment = require('moment'),
    jade = require('jade'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    Invitation = mongoose.model('Invitation'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group'),
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
            queryParams.from = user.skynetuuid;
        }

        if (searchParams.received) {
            queryParams.$or = [];
            queryParams.push({
                'recipient.uuid': user.skynetuuid
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
                var inviteData = {};
                inviteData.recipient = {email: email};
                inviteData.from = req.user.skynetuuid;
                inviteData.status = 'PENDING';
                inviteData.sent = moment.utc();

                if (rcp) {
                    inviteData.recipient.uuid = recipient.skynetuuid;
                }

                var invitation = new Invitation(inviteData);
                invitation.save();
                return invitation;
            }, function (err) {
                console.log('error!');
                console.log(err);
            })
            .then(function (invite) {

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
        Invitation.findById(req.params.id).exec()
            .then(function (inv) {
                invitation = inv;
                console.log('inv', inv);
                if (invitation.status === 'ACCEPTED') {
                    res.redirect('/home');
                } else {
                    return User.findBySkynetUUID(invitation.from)
                        .then(function (snd) {
                            sender = snd;
                            if (invitation.recipient.uuid) {
                                return User.findBySkynetUUID(invitation.recipient.uuid);
                            }
                            else {
                                return User.findByEmail(invitation.recipient.email);
                            }
                        }).then(function (rcp) {
                            recipient = rcp;
                            if (!recipient || recipient.skynetuuid !== req.user.skynetuuid) {
                                res.redirect('/signup');
                            } else {
                                return Group.findOne({'type': 'operators', 'resource.owner.uuid': sender.resource.uuid }).exec()
                                    .then(function (operatorGroup) {
                                        operatorGroup = operatorGroup ||
                                            new Group({
                                                name: 'operators',
                                                'type': 'operators',
                                                resource: {
                                                    owner: user.resourceId
                                                }
                                            });

                                        var existingMember = _.findWhere(operatorGroup.members, {'uuid': recipient.resource.uuid });
                                        //We are seeing if the recipient is already part of the operators group. If the member is
                                        //already part of the
                                        if (!existingMember) {
                                            operatorGroup.members.push(recipient.resourceId);
                                            invitation.accepted = moment.utc();
                                            invitation.status = "ACCEPTED";
                                            invitation.save();
                                            operatorGroup.save();
                                        } else {
                                            //Make sure
                                            if (invitation.status === "PENDING") {
                                                invitation.status = "ACCEPTED";
                                                invitation.accepted = moment.utc();
                                                invitation.save();
                                            }
                                        }
                                        res.redirect('/home');
                                    });
                            }
                        })
                }
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
