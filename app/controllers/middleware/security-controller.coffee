_ = require 'lodash'
UserSession = require '../../models/user-session-model'
basicAuth = require 'basic-auth'

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

    userAcceptedDate = new Date(request.user.userDevice?.octoblu?.termsAcceptedAt ? null)
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

  getAuthFromBasic: (request) =>
    return {} unless request.headers?
    auth = basicAuth request
    return {} unless auth?
    {name, pass} = auth
    return {} unless name && pass
    return uuid: name, token: pass

  getAuthFromBearer: (request) =>
    return {} unless request.headers?
    parts = request.headers.authorization?.split(' ')
    return {} unless parts? && parts[0] == 'Bearer'

    auth = new Buffer(parts[1], 'base64').toString().split(':')
    uuid = auth[0]
    token = auth[1]
    return {} unless uuid && token

    return uuid: uuid, token: token

  getAuthFromAnywhere: (request) =>
    {uuid, token} = @getAuthFromHeaders(request)
    {uuid, token} = @getAuthFromBearer(request) unless uuid && token
    {uuid, token} = @getAuthFromBasic(request) unless uuid && token
    {uuid, token} = @getAuthFromCookies(request) unless uuid && token
    return uuid: uuid, token: token

  authenticateWithMeshblu: (uuid, token, callback=->) =>
    return callback new Error('No UUID or Token found') unless uuid && token
    @userSession.getDeviceFromMeshblu uuid, token, (error, userDevice) =>
      return callback error if error?
      @userSession.ensureUserExists uuid, (error, user) =>
        return callback error if error?
        callback null, user, userDevice

  isAuthenticated: (request, response, next=->) =>
    return next() if request.bypassAuth

    authenticateCallback = (error, user, userDevice) =>
      return response.status(401).end() if error?
      return response.status(404).end() unless user?
      user.userDevice = userDevice
      request.login user, next

    {uuid, token} = @getAuthFromAnywhere request
    @authenticateWithMeshblu uuid, token, authenticateCallback

module.exports = SecurityController
