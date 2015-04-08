'use strict'
_ = require 'lodash'
debug = require('debug')('octoblu:flow-auth-credentials-controller')

class FlowAuthCredentialsController
  constructor: (@meshbluJSON, @dependencies={}) ->
    @MeshbluHttp = @dependencies.MeshbluHttp ? require '../../meshblu-http'
    @meshbluDb = @dependencies.meshbluDb ? require '../lib/database'

  show: (request, response) =>
    uuid = request.params.id
    {token, access_token, type} = request.query
    @verifyDevice uuid, token, (error, device) =>
      return response.status(401).send() if error?
      debug 'found device', device
      @getAccessToken device.owner, type, access_token, (error, token) =>
        debug 'got token', token, error
        return response.status(401).send() if error?
        response.status(200).send({access_token: token})

  verifyDevice: (uuid, token, callback=(->)) =>
    debug 'verifyDevice', uuid, token
    @meshbluHttp = new @MeshbluHttp _.extend({}, @meshbluJSON, protocol: 'http', uuid: uuid, token: token)
    @meshbluHttp.device uuid, callback

  getAccessToken: (uuid, type, access_token, callback=(->)) =>
    debug 'getAccessToken', uuid, type, access_token
    User.findUserAndApiByChannelType(uuid, type).then (channelAuth) =>
      debug 'foundAuth', channelAuth
      return callback new Error('Invalid Token') if channelAuth.token != access_token
      callback null, channelAuth.token
    .catch callback

module.exports = FlowAuthCredentialsController
