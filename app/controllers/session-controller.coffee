class SessionController
  @ERROR_RETRIEVING_SESSION = 'Error retrieving session'

  constructor: (@dependencies={}) ->
    @dependencies.UserSession ?= require '../models/user-session-model'

  show: (request, response) =>
    {uuid,token} = request.query
    userSession = new @dependencies.UserSession
    userSession.create uuid, token, (error, user) =>
      return response.status(500).send(SessionController.ERROR_RETRIEVING_SESSION) if error?
      request.login user, (error) =>
        if error?
          info = 
            message: error.message
            stack: error.stack
            user: user
          return response.status(500).send(info) if error?
        response.redirect '/'
     
module.exports = SessionController
  
