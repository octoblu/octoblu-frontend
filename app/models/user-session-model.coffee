url = require 'url'
async = require 'async'
bcrypt = require 'bcrypt'
_ = require 'lodash'

class UserSession
  @ERROR_DEVICE_NOT_FOUND: 'Meshblu device not found'
  @ERROR_FAILED_TO_GET_SESSION_TOKEN: 'Failed to get session token'
  @ERROR_FAILED_TO_UPDATE_DEVICE: 'Failed to update device'

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

  invalidateOneTimeToken: (uuid, token, callback=->) =>
    rejectToken = (tokenObj, cb=->) =>
      bcrypt.compare token, tokenObj.hash, (error, result) =>
        cb result

    @getDeviceFromMeshblu uuid, token, (error, device) =>
      return callback error if error?

      async.reject device.tokens, rejectToken, (tokens) =>
        @updateDevice uuid, token, {uuid: 'uuid', tokens: tokens}, callback

  updateDevice: (uuid, token, device, callback) =>
    @_meshbluRequest uuid, token, 'PUT', "/devices/#{uuid}", device, (error, response) =>
      return callback error if error?
      return callback new Error(UserSession.ERROR_FAILED_TO_UPDATE_DEVICE) unless response.statusCode == 200
      callback()

  _meshbluCreateSessionToken: (uuid, token, callback=->) =>
    @_meshbluRequest uuid, token, 'POST', "/devices/#{uuid}/tokens", callback

  _meshbluGetDevice: (uuid, token, callback=->) =>
    @_meshbluRequest uuid, token, 'GET', "/devices/#{uuid}", callback

  _meshbluRequest: (uuid, token, method, path, json=true, callback=->) =>
    if _.isFunction json
      callback = json
      json = true

    {host, port} = @config.skynet

    options = {
      uri: url.format({
        protocol: if port == 443 then 'https' else 'http'
        hostname: host
        port:     port
        pathname: path
      })
      method: method
      headers: 
        meshblu_auth_uuid:  uuid
        meshblu_auth_token: token
      json: json
    }
    
    @request options, callback
  
module.exports = UserSession
