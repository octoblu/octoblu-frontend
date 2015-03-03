UserSession = require '../../app/models/user-session-model'

describe 'UserSession', ->
  beforeEach ->
    @config = skynet: {host: 'meshblu.octoblu.com', port: 80}
    @request = sinon.stub()
    @sut = new UserSession request: @request, config: @config

  describe '->create', ->
    describe 'when called with a uuid and token', ->
      beforeEach ->
        sinon.spy(@sut, 'exchangeOneTimeTokenForSessionToken')
        @sut.create 'buried', 'leads'

      it 'should call exchangeOneTimeTokenForSessionToken', ->
        expect(@sut.exchangeOneTimeTokenForSessionToken).to.have.been.calledWith 'buried', 'leads'

    describe 'when exchangeOneTimeTokenForSessionToken yields an error', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields new Error('Cannibalism')
        @sut.create 'buried', 'leads', (@error) => done()

      it 'should yield and error', ->
        expect(@error).to.exist


    describe 'when and exchangeOneTimeTokenForSessionToken yields an error', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields new Error('Lighthouse out of order')
        @sut.create 'chemicals', 'periodical', (@error) => done()

      it 'should yield an error', ->
        expect(@error).to.exist

    describe 'when and exchangeOneTimeTokenForSessionToken yields a token and invalidateOneTimeToken yields nothing', ->
      beforeEach ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields null, 'i-am-a-session-token-trust-me'
        sinon.spy(@sut,  'ensureUserExists')
        @sut.create 'chemicals', 'periodical'

      it 'should call ensureUserExists', ->
        expect(@sut.ensureUserExists).to.have.been.calledWith 'chemicals', 'i-am-a-session-token-trust-me'

    describe 'when and exchangeOneTimeTokenForSessionToken yields a token and invalidateOneTimeToken yields nothing and ensureUserExists yields an error', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields null, 'i-am-a-session-token-trust-me'
        sinon.stub(@sut, 'ensureUserExists').yields new Error('Revenge. You know what you did.')
        @sut.create 'chemicals', 'periodical', (@error) => done()

      it 'should yield an error', ->
        expect(@error).to.exist

    describe 'when and exchangeOneTimeTokenForSessionToken yields a token and invalidateOneTimeToken yields nothing and ensureUserExists yields a nothing', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields null, 'i-am-a-session-token-trust-me'
        sinon.stub(@sut, 'ensureUserExists').yields null
        @sut.create 'chemicals', 'periodical', (@error, @session) => done()

      it 'should call the callback', ->
        expect(@session).to.deep.equal {uuid: 'chemicals', token: 'i-am-a-session-token-trust-me'}

  describe '->createNewSessionToken', ->
    beforeEach ->
      @sut.createNewSessionToken 'uuid', 'token'

    it 'should call request', ->
      headers = meshblu_auth_uuid: 'uuid', meshblu_auth_token: 'token'
      expect(@request).to.have.been.calledWith uri: 'http://meshblu.octoblu.com:80/devices/uuid/tokens', method: 'POST', headers: headers, json: true

    describe 'when request returns an error', ->
      beforeEach (done) ->
        @request.yields new Error("Luge, I'm gonna let this one slide")
        @sut.createNewSessionToken 'uuid', 'token', (@error) => done()

      it 'should have an error', ->
        expect(@error).to.exist
        
    describe 'when meshblu yields a 400', ->
      beforeEach (done) ->
        @request.yields null, statusCode: 400
        @sut.createNewSessionToken 'uuid', 'token', (@error) => done()

      it 'should have an error', ->
        expect(@error.message).to.equal UserSession.ERROR_FAILED_TO_GET_SESSION_TOKEN

    describe 'when meshblu yields a 200', ->
      beforeEach (done) ->
        @request.yields null, {statusCode: 200}, {uuid: 'uuid', token: 'session-token'}
        @sut.createNewSessionToken 'uuid', 'token', (@error, @result) => done()

      it 'should have an error', ->
        expect(@result).to.deep.equal 'session-token'

  describe '->getDeviceFromMeshblu', ->
    describe 'when called with uuid and token', ->
      beforeEach ->
        @sut.getDeviceFromMeshblu 'uuid', 'token'

      it 'should try to retrieve the device from Meshblu', ->
        headers = meshblu_auth_uuid: 'uuid', meshblu_auth_token: 'token'
        expect(@request).to.have.been.calledWith uri: 'http://meshblu.octoblu.com:80/devices/uuid', headers: headers, json: true

    describe 'when called with a different uuid and token', ->
      beforeEach ->
        @sut.getDeviceFromMeshblu 'forgot', 'to-breathe'

      it 'should try to retrieve the device from Meshblu', ->
        headers = meshblu_auth_uuid: 'forgot', meshblu_auth_token: 'to-breathe'
        expect(@request).to.have.been.calledWith uri: 'http://meshblu.octoblu.com:80/devices/forgot', headers: headers, json: true

    describe 'when called with a different meshblu configuration', ->
      beforeEach ->
        @config.skynet = host: 'localhost', port: 3000
        @sut.getDeviceFromMeshblu 'forgot', 'to-breathe'

      it 'should try to retrieve the device from Meshblu', ->
        options =
          uri: 'http://localhost:3000/devices/forgot'
          json: true
          headers:
            meshblu_auth_uuid: 'forgot'
            meshblu_auth_token: 'to-breathe'
        expect(@request).to.have.been.calledWith options

    describe 'when the meshblu configuration uses port 443', ->
      beforeEach ->
        @config.skynet = host: 'meshblu.octoblu.com', port: 443
        @sut.getDeviceFromMeshblu 'abandoned', 'in-space'

      it 'should use the https protocol', ->
        options =
          uri: 'https://meshblu.octoblu.com:443/devices/abandoned'
          json: true
          headers:
            meshblu_auth_uuid: 'abandoned'
            meshblu_auth_token: 'in-space'
        expect(@request).to.have.been.calledWith options
    
    describe 'when called and meshblu responds with an error', ->
      beforeEach (done) ->
        @request.yields new Error('unspecified error')
        @sut.getDeviceFromMeshblu 'bear', 'grizzly', (@error) => done()

      it 'should call its callback with the error', ->
        expect(@error.message).to.equal 'unspecified error'

    describe 'when called and meshblu responds with a device', ->
      beforeEach (done) ->
        @request.yields null, null, devices: [{uuid: 'bear', name: 'rustle'}]
        @sut.getDeviceFromMeshblu 'bear', 'grizzly', (@error, @result) => done()

      it 'should call its callback with no error', ->
        expect(@error).not.to.exist

      it 'should call its callback with the device', ->
        expect(@result).to.deep.equal uuid: 'bear', name: 'rustle'

    describe 'when called and meshblu responds with no device', ->
      beforeEach (done) ->
        @request.yields null, null, devices: []
        @sut.getDeviceFromMeshblu 'bear', 'grizzly', (@error, @result) => done()

      it 'should call its callback with an error', ->
        expect(@error.message).to.equal UserSession.ERROR_DEVICE_NOT_FOUND
