url = require 'url'
async = require 'async'

class UserSession
  @ERROR_DEVICE_NOT_FOUND: 'Meshblu device not found'
  @ERROR_FAILED_TO_GET_SESSION_TOKEN: 'Failed to get session token'

  constructor: (dependencies={}) ->
    @request = dependencies.request ? require 'request'
    @config  = dependencies.config ? require '../../config/auth'

  create: (uuid, token, callback=->) =>
    @exchangeOneTimeTokenForSessionToken uuid, token, (error, sessionToken) =>
      return callback error if error?

      @ensureUserExists uuid, sessionToken, (error) =>
        return callback error if error?

        callback null, {uuid: uuid, token: sessionToken}

  createNewSessionToken: (uuid, token, callback) =>
    @_meshbluCreateSessionToken uuid, token, (error, response, body) =>
      return callback error if error?
      return callback new Error(UserSession.ERROR_FAILED_TO_GET_SESSION_TOKEN) unless response.statusCode == 200
      callback null, body.token

  ensureUserExists: =>

  exchangeOneTimeTokenForSessionToken: (uuid, token, callback=->) => 
    @createNewSessionToken uuid, token, (error, sessionToken) =>
      return callback error if error?

      @invalidateOneTimeToken uuid, token, (error) => 
        return callback error if error?
        callback null, sessionToken

  getDeviceFromMeshblu: (uuid, token, callback=->) =>
    @_meshbluGetDevice uuid, token, (error, response, body) =>
      return callback error if error?
      return callback new Error(UserSession.ERROR_DEVICE_NOT_FOUND) unless body.devices[0]?

      callback null, body.devices[0]

  invalidateOneTimeToken: =>

  _meshbluGetDevice: (uuid, token, callback=->) =>
    {host, port} = @config.skynet

    options = {
      uri: url.format({
        protocol: if port == 443 then 'https' else 'http'
        hostname: host
        port:     port
        pathname: "/devices/#{uuid}"
      })
      headers: 
        meshblu_auth_uuid:  uuid
        meshblu_auth_token: token
      json: true
    }
    
    @request options, callback

  _meshbluCreateSessionToken: (uuid, token, callback=->) =>
    {host, port} = @config.skynet

    options = {
      uri: url.format({
        protocol: if port == 443 then 'https' else 'http'
        hostname: host
        port:     port
        pathname: "/devices/#{uuid}/tokens"
      })
      method: 'POST'
      headers: 
        meshblu_auth_uuid:  uuid
        meshblu_auth_token: token
      json: true
    }
    
    @request options, callback
  
module.exports = UserSession
