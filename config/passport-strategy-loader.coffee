_               = require 'lodash'
passport        = require 'passport'
passportRefresh = require 'passport-oauth2-refresh'
User            = require '../app/models/user'
glob            = require 'glob'

class PassportStrategyLoader
  constructor: ->
    @addSerializer()

  load: =>
    files = glob.sync 'config/passport-strategies/**/*\.*(js|coffee)'
    _.each files, (file) =>
      strategy = require "../#{file}"
      passport.use strategy
      passportRefresh.use strategy if strategy._oauth2

  addSerializer: =>
    passport.serializeUser (user, done) ->
      done null, user.skynet.uuid

    passport.deserializeUser (uuid, done) ->
      User.findOne 'skynet.uuid': uuid
      .catch done
      .then (user) ->
        done null, user

module.exports = PassportStrategyLoader

