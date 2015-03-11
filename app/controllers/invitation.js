var _ = require('lodash'),
  moment = require('moment'),
  jade = require('jade'),
  fs = require('fs'),
  uuid = require('node-uuid'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  Invitation = require('../models/invitation'),
  User = require('../models/user'),
  Group = require('../models/group');

/*
 File : invitation.js
 provides the REST API for finding, creating, deleting, sending and receiving invitations to Groups from Octoblu
 users
 */


var invitationController = {
  findInvitations: function(req, res, searchParams) {
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
      .then(function(invitations) {
        return res.json(invitations);
      }, function(err) {
        return res.json(500, [err]);
      });
  },
  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  getAllInvitations: function(req, res) {
    var searchParams = {
      sent: true,
      received: true
    };
    this.findInvitations(req, res, searchParams)
  },

  getInvitationsSent: function(req, res) {
    this.findInvitations(req, res, {
      sent: true
    });
  },

  getInvitationsReceived: function(req, res) {
    this.findInvitations(req, res, {
      received: true
    });
  },

  getInvitationById: function(req, res) {
    Invitation.findById(req.params.invitationId)
      .then(function(invitation) {
          res.send(invitation);
        },
        function(err) {
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
  sendInvitation: function(req, res) {
    var config = invitationController.config,
      sender = req.user,
      recipient, email = req.body.email;
    //1. Check if the recipient is already an existing octoblu user
    //2. Create a new invitation
    //3. Generate an HTML template for the invitation
    //4. send an outgoing email to the recipient email  with the HTML template generated in the previous step
    //and return the invitation to the user.

    return User.findByEmail(email)
      .then(function(rcp) {
        recipient = rcp;
        var inviteData = {
          uuid: uuid.v1(),
          recipient: {
            email: email
          },
          from: sender.skynet.uuid,
          status: 'PENDING',
          sent: moment.utc().toDate()
        }

        if (rcp) {
          inviteData.recipient.uuid = recipient.skynet.uuid;
        }

        return Invitation.insert(inviteData);

      }, function(err) {
        console.error(err);
      })
      .then(function(invites) {
        var invite = _.first(invites);

        var invitationTemplatePath = process.cwd() + config.email.invitation.templateUrl;
        var invitationUrl = req.protocol + "://" + req.header('host') + '/api/invitation/' + invite.uuid + '/accept';
        var options = {
          pretty: true,
          sender: sender,
          invitationUrl: invitationUrl
        };
        var messageHtml = jade.renderFile(invitationTemplatePath, options);

        var mailTransport = nodemailer.createTransport(smtpTransport(config.email.SMTP));

        var mailOptions = {
          from: config.email.from,
          to: invite.recipient.email,
          subject: 'Invitation to share devices on Octoblu from ' + sender.displayName,
          html: messageHtml
        };

        mailTransport.sendMail(mailOptions, function(error) {
          if (error) {
            console.error(error);
            res.json(500, {
              'error': 'Invitation email could not be sent'
            });
            return;
          }
          res.send(200, invite);
        });
      }, function(error) {
        res.json(500, {
          'error': error
        });
      });
  },

  acceptInvitation: function(req, res) {
    var invitation, sender, recipient;
    Invitation.findByUuid(req.params.id, function(error, invitation) {
      if (error) {
        console.error(error);
        return res.send(500, error);
      }

      if (!invitation) {
        return res.send(404);
      }

      if (invitation.status === 'ACCEPTED') {
        return res.redirect('/home');
      }

      return User.findBySkynetUUID(invitation.from)
        .then(function(snd) {
          sender = snd;
          if (invitation.recipient.uuid) {
            return User.findBySkynetUUID(invitation.recipient.uuid);
          }
          return User.findByEmail(invitation.recipient.email);
        })
        .then(function(rcp) {
          recipient = rcp;
          if (!recipient || recipient.skynet.uuid !== req.user.skynet.uuid) {
            return res.redirect('/signup');
          }
          return Group.findOne({
              'type': 'operators',
              'resource.owner.uuid': sender.resource.uuid
            })
            .then(function(operatorGroup) {
              operatorGroup = operatorGroup || {
                uuid: uuid.v1(),
                name: 'operators',
                type: 'operators',
                resource: {
                  owner: recipient.resource
                }
              };
              operatorGroup.members = operatorGroup.members || [];

              var existingMember = _.findWhere(operatorGroup.members, {
                'uuid': recipient.skynet.uuid
              });

              invitation.accepted = moment.utc().toDate();
              invitation.status = "ACCEPTED";
              Invitation.update({
                uuid: invitation.uuid
              }, invitation);

              if (!existingMember) {
                var member = _.extend({ properties: { name: recipient.email }}, recipient.resource);
                operatorGroup.members.push(member);
                if (operatorGroup._id) {
                  Group.update({
                    uuid: operatorGroup.uuid
                  }, operatorGroup);
                } else {
                  Group.insert(operatorGroup);
                }
              }

              res.redirect('/home');
            });
        });
    });
  },

  deleteInvitation: function(req, res) {
    Invitation.findByIdAndRemove(req.params.invitationId, function(err, invitation) {
      if (err) {
        res.json(500, err);
      }
      res.json(200, invitation);
    });
  }
};

module.exports = function(app, passport, config) {

  //set the configuration for the controller
  invitationController.config = config;
  app.get('/api/user/invitations', invitationController.getAllInvitations);
  app.get('/api/user/invitations/sent', invitationController.getInvitationsSent);
  app.get('/api/user/invitations/received', invitationController.getInvitationsReceived);
  app.get('/api/user/invitation/:invitationId', invitationController.getInvitationById);
  app.post('/api/user/invitation/send', invitationController.sendInvitation);
  app.get('/api/invitation/:id/accept', invitationController.acceptInvitation);
  app.delete('/api/invitations/:invitationId', invitationController.deleteInvitation);
};
