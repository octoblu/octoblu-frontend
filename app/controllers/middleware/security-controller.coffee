_ = require 'lodash'
UserSession = require '../../models/user-session-model'

class SecurityController
  constructor: (dependencies={}) ->
    @userSession = dependencies.userSession ? new UserSession

  bypassAuth: (request, response, next=->) =>
    request.bypassAuth = true
    next()

  bypassTerms: (request, response, next=->) =>
    request.bypassTerms = true
    next()

  enforceTerms: (request, response, next=->) =>
    return next() if request.bypassTerms
    return next() unless request.user?

    userAcceptedDate = new Date request.user.terms_accepted_at
    termsDate = new Date '2015-02-13T22:00:00.000Z'
    return next() if userAcceptedDate.getTime() >= termsDate.getTime()

    response.status(403).send 'Terms of service must be accepted'

  getAuthFromHeaders: (request) =>
    headers = request.headers ? {}

    uuid  = headers.skynet_auth_uuid ? headers.meshblu_auth_uuid
    token = headers.skynet_auth_token ? headers.meshblu_auth_token

    return uuid: uuid, token: token

  getAuthFromCookies: (request) =>
    return {} unless request.user?
    user = request.user
    cookies = request.cookies ? {}

    return uuid: cookies.meshblu_auth_uuid, token: cookies.meshblu_auth_token

  authenticateWithMeshblu: (uuid, token, callback=->) =>
    @userSession.getDeviceFromMeshblu uuid, token, (error) =>
      return callback error if error?
      @userSession.ensureUserExists uuid, (error, user) =>
        return callback error if error?
        callback null, user

  isAuthenticated: (request, response, next=->) =>
    return next() if request.bypassAuth

    authenticateCallback = (error, user) =>
      return response.status(401).end() if error?  
      return response.status(404).end() unless user?
      request.login user, next

    {uuid, token} = @getAuthFromHeaders(request)
    return @authenticateWithMeshblu uuid, token, authenticateCallback if uuid && token

    {uuid, token} = @getAuthFromCookies(request)
    return response.status(401).end() unless uuid && token

    @authenticateWithMeshblu uuid, token, authenticateCallback

module.exports = SecurityController
