class ProfileController

  constructor: (@dependencies={}) ->
    @dependencies.User ?= require '../models/user'

  create: (req, res)->
    @dependencies.User.updateProfileBySkynetUUID(req.user.uuid, req.body)


module.exports = ProfileController