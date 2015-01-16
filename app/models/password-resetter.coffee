When = require 'when'
User = require './user'

class PasswordResetter
  resetByEmail: (email) =>
    return User.findByEmail(email).then (user) ->
      if !user
        throw new Error('user not found')

module.exports = PasswordResetter
