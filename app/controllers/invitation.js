var _ = require('lodash'),
    moment = require('moment'),
    jade = require('jade'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    InvitationSchema = require('../models/invitation'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group'),
    Invitation = mongoose.model('Invitation', InvitationSchema);
/*
 File : invitation.js
 provides the REST API for finding, creating, deleting, sending and receiving invitations to Groups from Octoblu
 users
 */


var invitationController = {
    /**
     *
     * @param req
     * @param res
     * @param searchParams
     * @returns {*}
     */
    findInvitations: function (req, res, searchParams) {
        if (req.params.id && req.params.token) {

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
            }, function (err, user) {
                if (err) {
                    return res.json(500, [err])
                }
                //build the search query for invitations. Check to see if we want to
                //check for sent or received invitations.
                var queryParams = {};
                if (searchParams.sent) {
                    queryParams.from = user.skynetuuid;
                }

                if (searchParams.received) {
                    var email = user.local.email || user.google.email || user.facebook.email;
                    queryParams.$or = [];
                    queryParams.push({
                        'recipient.uuid': user.skynetuuid
                    });
                    queryParams.push({
                        'recipient.email': email
                    });
                }

                Invitation.find(queryParams, function (err, invitations) {
                    if (err) {
                        return res.json(500, [err]);
                    }
                    return res.json(200, invitations);
                });
            });

        } else {
            return res.json(400, [
                {
                    error: 'one or more required parameters is missing'
                }
            ]);
        }

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
        return this.findInvitations(req, res, searchParams)

    },
    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    getInvitationsSent: function (req, res) {
        var searchParams = {
            sent: true
        };
        return this.findInvitations(req, res, searchParams);
    },

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    getInvitationsReceived: function (req, res) {
        var searchParams = {
            received: true
        };
        return this.findInvitations(req, res, searchParams);
    },

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    getInvitationById: function (req, res) {
        if (req.params.id && req.params.token && req.params.invitationId) {

            var uuid = req.params.id;
            var token = req.params.token;
            var invitationId = req.params.invitationId;
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
            }, function (err, user) {
                if (!err) {
                    return res.JSON(404, err);
                } else {
                    Invitation.findById(invitationId, function (err, invitation) {
                        if (err) {
                            res.json(500, err);
                        }
                        res.json(200, invitation);
                    });
                }
            });
        } else {
            return res.json(400, {
                error: 'One or more required parameters is missing'
            });
        }
    },

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    sendInvitation: function (req, res) {

        if (req.params.id && req.params.token) {

            var uuid = req.params.id;
            var token = req.params.token;
            var email = req.body.email;
            var config = invitationController.config;

            var sender;
            var recipient;

            var userPromise = User.findBySkynetUUIDAndToken( uuid, token );
            //1. Find the user with the give UUID and Token
            //2. Check if the recipient is already an existing octoblu user
            //3. Create a new invitation
            //4. Generate an HTML template for the invitation
            //5. send an outgoing email to the recipient email  with the HTML template generated in the previous step
            //and return the invitation to the user.


            userPromise
                .then(function (usr) {
                    sender = usr;
                    return User.findOne({
                        $or: [
                            { 'local.email': email },
                            {'google.email': email },
                            {'facebook.email': email }
                        ]
                    }).exec();
                })
                .then(function (rcp) {
                    recipient = rcp;
                    var inviteData = {};
                    inviteData.recipient = {};
                    inviteData.recipient.email = email;
                    inviteData.from = uuid;
                    inviteData.status = 'PENDING';
                    inviteData.sent = moment.utc();

                    if (rcp) {
                        inviteData.recipient.uuid = recipient.skynetuuid;
                    }

                    var invitation = new Invitation(inviteData);
                    invitation.save();
                    return invitation;
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
                }, function(error){
                    res.json(500, {
                        'success': false,
                        'error': error
                    });
                });

        } else {
            return res.json(400, {
                error: 'One or more required parameters is missing'
            });
        }
    },

    /**
     *
     * @param req
     * @param res
     */
    acceptInvitation: function (req, res, next) {
        var invitation, sender, recipient;
        Invitation.findById(req.params.id).exec().then(function (inv) {
            invitation = inv;
            console.log('inv',inv);
            if (invitation.status === 'ACCEPTED') {
                res.redirect('/dashboard');
            } else {
                return User.findBySkynetUUID(invitation.from)
            }
        }).then(function (snd) {
            sender = snd;
            console.log('snd',snd)
            if (invitation.recipient.uuid) {
                return User.findBySkynetUUID(invitation.recipient.uuid);
            }
            else {
                return User.findByEmail(invitation.recipient.email);
            }
        }).then(function (rcp) {
            recipient = rcp;
            console.log('rcp',rcp);

            // if (!recipient || recipient._id !== req.session.user._id) {
            if (!recipient || recipient.skynetuuid !== req.cookies.skynetuuid) {
                console.log('redirecting', recipient.skynetuuid, req.cookies.skynetuuid);
                res.redirect('/signup');
            } else {

                console.log('here');
                var operatorGroup = _.findWhere(sender.groups, {'type': 'operators'});
                console.log('operatorGroup', operatorGroup);

                if (!operatorGroup) {
                    operatorGroup = {'uuid': uuid.v1(), 'type': 'operators', members: []};
                    sender.groups.push(operatorGroup);

                }

                var existingMember = _.findWhere(operatorGroup.members, {'uuid': recipient.skynetuuid });
                //We are seeing if the recipient is already part of the operators group. If the member is
                //already part of the
                if (! existingMember ) {
                    operatorGroup.members.push({uuid: recipient.skynetuuid, name: recipient.displayName });
                    invitation.accepted = moment.utc();
                    invitation.status = "ACCEPTED";
                    invitation.save();
                    sender.markModified('groups');
                    sender.save();
                } else {
                    //Make sure
                    if(invitation.status === "PENDING"){
                        invitation.status = "ACCEPTED";
                        invitation.accepted = moment.utc();
                        invitation.save();
                    }
                }
            }
            res.redirect('/dashboard');
        }, function(error){
            console.log(JSON.stringify(error));
            res.send(500, {'error' : 'Could not accept invitation'});
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    deleteInvitation: function (req, res) {
        if (req.params.id && req.params.token && req.params.invitationId) {

            var uuid = req.params.id;
            var token = req.params.token;
            var invitationId = req.params.invitationId;
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
            }, function (err, user) {
                if (!err) {
                    return res.JSON(404, err);
                } else {
                    Invitation.findByIdAndRemove(invitationId, function (err, invitation) {
                        if (err) {
                            res.json(500, err);
                        }
                        res.json(200, invitation);
                    });
                }
            });
        } else {
            return res.json(400, {
                error: 'One or more required parameters is missing'
            });
        }

    }
};

module.exports = function (app, passport, config) {

    //set the configuration for the controller
    invitationController.config = config;
    app.get('/api/user/:id/:token/invitations', invitationController.getAllInvitations);
    app.get('/api/user/:id/:token/invitations/sent', invitationController.getInvitationsSent);
    app.get('/api/user/:id/:token/invitations/received', invitationController.getInvitationsReceived);
    app.get('/api/user/:id/:token/invitation/:invitationId', invitationController.getInvitationById);
    app.put('/api/user/:id/:token/invitation/send', invitationController.sendInvitation);
    app.delete('/api/user/:id/:token/invitations/:invitationId', invitationController.deleteInvitation);
    app.get('/api/invitation/:id/accept', requireAuthorized, invitationController.acceptInvitation );
//
    function requireAuthorized(req, res, next) {
        // if (!req.session.user || !req.session.user.id) {
        if (!req.cookies.skynetuuid && !req.cookies.skynettoken) {
            req.session.redirect = req.url;
            res.redirect('/login');
        } else {
            next();
        }
    }
};
