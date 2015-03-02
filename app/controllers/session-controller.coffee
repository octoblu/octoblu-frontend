class SessionController
  constructor: (@dependencies={}) ->
    @dependencies ?= require '../models/user-session-model'

  show: (request, response) =>
    {uuid,token} = request.query
    userSession = new @dependencies.UserSession
    userSession.create uuid, token, (error) =>
      return response.send 500, 'Error retrieving session' if error?
      response.send 200
     
module.exports = SessionController
  
