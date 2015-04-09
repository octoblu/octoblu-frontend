'use strict'
_ = require 'lodash'
debug = require('debug')('octoblu:flow-auth-credentials-controller')
textCrypt = require '../lib/textCrypt'
moment = require 'moment'
passportRefresh = require 'passport-oauth2-refresh'

class FlowAuthCredentialsController
  constructor: (@meshbluJSON, @dependencies={}) ->
    @MeshbluHttp = @dependencies.MeshbluHttp ? require '../../meshblu-http'
    @meshbluDb = @dependencies.meshbluDb ? require '../lib/database'

  show: (request, response) =>
    uuid = request.params.id
    {token, type, access_token} = request.query
    @verifyDevice uuid, token, (error, device) =>
      return response.status(401).send() if error?
      debug 'found device', device
      @getAccessToken device.owner, type, access_token, (error, auth) =>
        debug 'got token', auth, error
        return response.status(401).send() if error?
        response.status(200).send access_token: auth.token, access_token_secret: auth.secret

  verifyDevice: (uuid, token, callback=(->)) =>
    debug 'verifyDevice', uuid, token
    @meshbluHttp = new @MeshbluHttp _.extend({}, @meshbluJSON, protocol: 'http', uuid: uuid, token: token)
    @meshbluHttp.device uuid, callback

  getAccessToken: (uuid, type, access_token, callback=(->)) =>
    debug 'getAccessToken', uuid, type, access_token
    User.findUserAndApiByChannelType(uuid, type)
    .catch callback
    .then (channelAuth) =>
      debug 'foundAuth', channelAuth
      return callback new Error('Invalid Token') unless @isAccessTokenValid access_token, channelAuth

      @refreshToken uuid, channelAuth, type, callback

  getDecryptedTokenAndSecret: (channelAuth) =>
    channel_token = channelAuth.token
    channel_secret = channelAuth.secret
    if channelAuth.token_crypt?
      channel_token = textCrypt.decrypt(channelAuth.token_crypt)
      channel_secret = textCrypt.decrypt(channelAuth.secret_crypt)

    return token: channel_token, secret: channel_secret

  isAccessTokenValid: (access_token, channelAuth) =>
    {token} = @getDecryptedTokenAndSecret channelAuth
    debug 'compareAuth', token, access_token, token == access_token
    return token == access_token

  refreshToken: (uuid, channelAuth, type, callback=(->)) =>
    debug 'refreshToken', channelAuth.refreshToken, channelAuth.expiresOn, moment().isAfter(channelAuth.expiresOn)
    return callback null, @getDecryptedTokenAndSecret(channelAuth) unless channelAuth.refreshToken? && moment().isAfter(channelAuth.expiresOn)
    passportRefresh.requestNewAccessToken _.last(type.split(':')), channelAuth.refreshToken, (error, accessToken, refreshToken) =>
      channelAuth.token = accessToken
      channelAuth.refreshToken = refreshToken
      User.addApiToUserByChannelType uuid, type, channelAuth
      .catch callback
      .then ->
        callback null, token: accessToken

module.exports = FlowAuthCredentialsController
