SecurityController = require '../../../app/controllers/middleware/security-controller'

describe 'SecurityController', ->
  beforeEach ->
    @userSession = {}
    @dependecies = userSession: @userSession
    @sut = new SecurityController @dependecies

  describe '->isAuthenticated', ->
    describe 'when called with a user', ->
      beforeEach (done) ->
        @next = sinon.spy done
        @sut.isAuthenticated user: {}, {}, @next

      it 'should call next()', ->
        expect(@next).to.have.been.called

    describe 'when called without a user, uuid, or token', ->
      beforeEach (done) ->
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy(=> done())
        @sut.isAuthenticated {}, @response

      it 'should call response.status with a 401', ->
        expect(@response.status).to.have.been.calledWith 401

      it 'should call response.end()', ->
        expect(@response.end).to.have.been.called

    describe 'when called without a user, but bypassAuth', ->
      beforeEach (done) ->
        @next = sinon.spy(done)
        @sut.isAuthenticated {bypassAuth: true}, {}, @next

      it 'should call next', ->
        expect(@next).to.have.been.called

    describe 'when called without a user and with valid uuid and token', ->
      beforeEach ->
        @next = sinon.spy()
        @userSession.getDeviceFromMeshblu = sinon.stub()
        @userSession.ensureUserExists = sinon.stub()
        @request =
          headers:
            skynet_auth_uuid: 'steak'
            skynet_auth_token: 'fries'
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy()
        @sut.isAuthenticated @request, @response, @next

      it 'should call userSession.getDeviceFromMeshblu()', ->
        expect(@userSession.getDeviceFromMeshblu).to.have.been.calledWith 'steak', 'fries'

      describe 'when getDeviceFromMeshblu yields an error', ->
        beforeEach (done) ->
          @response.end = sinon.spy(done)
          @userSession.getDeviceFromMeshblu.yield new Error('no device')

        it 'should call response.status(401).end()', ->
          expect(@response.status).to.have.been.calledWith 401
          expect(@response.end).to.have.been.called

      describe 'when getDeviceFromMeshblu yields a device', ->
        beforeEach (done) ->
          @userSession.ensureUserExists = sinon.spy(=> done())
          @userSession.getDeviceFromMeshblu.yield null, uuid: 'steak'

        it 'should ensureUserExists with the uuid and token', ->
          expect(@userSession.ensureUserExists).to.have.been.calledWith 'steak', 'fries'

      describe 'when getDeviceFromMeshblu yields a device and ensureUserExists yields an error', ->
        beforeEach (done) ->
          @response.end = sinon.spy(done)
          @userSession.ensureUserExists = sinon.stub().yields new Error()
          @userSession.getDeviceFromMeshblu.yield null, uuid: 'steak'

        it 'should res.status(500).end()', ->
          expect(@response.status).to.have.been.calledWith 500
          expect(@response.end).to.have.been.called

      describe 'when getDeviceFromMeshblu yields a device and ensureUserExists yields no error', ->
        beforeEach ->
          @user = {something: 'user-y'}
          @request.login = sinon.stub().yields()
          @userSession.ensureUserExists = sinon.stub().yields null, @user
          @userSession.getDeviceFromMeshblu.yield null, uuid: 'steak'

        it 'should call request.login with the user', ->
          expect(@request.login).to.have.been.calledWith @user

        it 'should call next()', ->
          expect(@next).to.have.been.called

    describe 'when called without a user and with a different valid uuid and token', ->
      beforeEach ->
        @next = sinon.spy()
        @userSession.getDeviceFromMeshblu = sinon.stub()
        @userSession.ensureUserExists = sinon.stub()
        request =
          headers:
            skynet_auth_uuid: 'pancakes'
            skynet_auth_token: 'eggs'
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy()
        @sut.isAuthenticated request, @response, @next

      it 'should call userSession.getDeviceFromMeshblu()', ->
        expect(@userSession.getDeviceFromMeshblu).to.have.been.calledWith 'pancakes', 'eggs'

      describe 'when getDeviceFromMeshblu yields an error', ->
        beforeEach (done) ->
          @response.end = sinon.spy(done)
          @userSession.getDeviceFromMeshblu.yield new Error('no device')

        it 'should call response.status(401).end()', ->
          expect(@response.status).to.have.been.calledWith 401
          expect(@response.end).to.have.been.called

      describe 'when getDeviceFromMeshblu yields a device', ->
        beforeEach (done) ->
          @userSession.ensureUserExists = sinon.spy(=> done())
          @userSession.getDeviceFromMeshblu.yield null, uuid: 'pancakes'

        it 'should ensureUserExists with the uuid and token', ->
          expect(@userSession.ensureUserExists).to.have.been.calledWith 'pancakes', 'eggs'

  describe '->bypassAuth', ->
    describe 'when called with req, res, next', ->
      beforeEach (done) ->
        @next = sinon.spy(done)
        @request = {}
        @sut.bypassAuth @request, {}, @next

      it 'should call next', ->
        expect(@next).to.have.been.called

      it 'should set bypassTerms on the request', ->
        expect(@request.bypassAuth).to.be.true

  describe '->bypassTerms', ->
    describe 'when called with req, res, next', ->
      beforeEach (done) ->
        @next = sinon.spy(done)
        @request = {}
        @sut.bypassTerms @request, {}, @next

      it 'should call next', ->
        expect(@next).to.have.been.called

      it 'should set bypassTerms on the request', ->
        expect(@request.bypassTerms).to.be.true

  describe '->enforceTerms', ->
    describe 'when called with a user that has not accepted the terms', ->
      beforeEach (done) ->
        request = user: {terms_accepted_at: null}
        @response =
          status: sinon.spy(=> @response)
          send: sinon.spy(=> done())
        @sut.enforceTerms request, @response

      it 'should call response.status(403)', ->
        expect(@response.status).to.have.been.calledWith 403

      it 'should call send with the terms of service', ->
        expect(@response.send).to.have.been.calledWith 'Terms of service must be accepted'

    describe 'when called with a user that has an undefined terms_accepted_at', ->
      beforeEach (done) ->
        request = user: {}
        @response =
          status: sinon.spy(=> @response)
          send: sinon.spy(=> done())
        @sut.enforceTerms request, @response

      it 'should call response.status(403)', ->
        expect(@response.status).to.have.been.calledWith 403

      it 'should call send with the terms of service', ->
        expect(@response.send).to.have.been.calledWith 'Terms of service must be accepted'

    describe 'when called with a user that has accepted the terms before they were last updated', ->
      beforeEach (done) ->
        request = user: {terms_accepted_at: '2015-01-01T00:00:00.000Z'}
        @response =
          status: sinon.spy(=> @response)
          send: sinon.spy(=> done())
        @sut.enforceTerms request, @response

      it 'should call response.status(403)', ->
        expect(@response.status).to.have.been.calledWith 403

      it 'should call send with the terms of service', ->
        expect(@response.send).to.have.been.calledWith 'Terms of service must be accepted'

    describe 'when called with a user that has accepted the terms', ->
      beforeEach (done) ->
        request = user: {terms_accepted_at: '2050-01-01T22:00:00.000Z'}
        @next = sinon.spy(done)
        @sut.enforceTerms request, {}, @next

      it 'should call next()', ->
        expect(@next).to.have.been.called

    describe 'when called without a user', ->
      beforeEach (done) ->
        @next = sinon.spy(done)
        @sut.enforceTerms {}, {}, @next

      it 'should call next()', ->
        expect(@next).to.have.been.called

    describe 'when called with a user and bypassTerms', ->
      beforeEach (done) ->
        @next = sinon.spy(done)
        request =
          user: {}
          bypassTerms : true
        @sut.enforceTerms request, {}, @next

      it 'should call next()', ->
        expect(@next).to.have.been.called






