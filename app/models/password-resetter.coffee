nodefn    = require 'when/node/function'
User      = require './user'
{Mailgun} = require 'mailgun'
PromisedMailgun = nodefn.liftAll Mailgun

class PasswordResetter
  resetByEmail: (email, host) =>
    User.findByEmail email
    .then (user) =>
      throw new Error('user not found') unless user?
      User.setResetPasswordToken user
    .then (user) =>
      @sendEmail user.email, user.resetPasswordToken, host


  sendEmail: (to, resetPasswordToken, host) =>
    mg      = new PromisedMailgun 'key-1363df07931b61ec9eeabda8702a8998'

    from = 'Do Not Reply <noreply@octoblu.com>'
    subject = 'Octoblu Password Reset'
    body = "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
           "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
           "http://#{host}/reset/#{resetPasswordToken}\n\n" +
           "If you did not request this, please ignore this email and your password will remain unchanged.\n"

    mg.sendText(from, to, subject, body)

module.exports = PasswordResetter
