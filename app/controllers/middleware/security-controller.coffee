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

  authenticateResponse: (request) =>
    headers = request.headers ? {}
    cookies = request.cookies ? {}

    uuid = headers.skynet_auth_uuid ? headers.meshblu_auth_uuid
    uuid ?= cookies.skynet_auth_uuid ? cookies.meshblu_auth_uuid
    token = headers.skynet_auth_token ? headers.meshblu_auth_token
    token ?= cookies.skynet_auth_token ? cookies.meshblu_auth_token

    return uuid: uuid, token: token

  isAuthenticated: (request, response, next=->) =>
    return next() if request.bypassAuth
    return next() if request.user

    {uuid, token} = @authenticateResponse(request)
    return response.status(401).end() unless uuid && token

    @userSession.getDeviceFromMeshblu uuid, token, (error) =>
      return response.status(401).end() if error?
      @userSession.ensureUserExists uuid, token, (error, user) =>
        return response.status(500).end() if error?
        request.login user, next

module.exports = SecurityController
