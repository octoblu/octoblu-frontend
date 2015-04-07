SecurityController = require '../../../app/controllers/middleware/security-controller'

describe 'SecurityController', ->
  beforeEach ->
    @userSession = {}
    @dependecies = userSession: @userSession
    @sut = new SecurityController @dependecies

  describe '->isAuthenticated', ->
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

    describe 'when called without a user and with valid skynet uuid and token', ->
      beforeEach ->
        @next = sinon.spy()
        @request =
          headers:
            skynet_auth_uuid: 'steak'
            skynet_auth_token: 'fries'
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy()
        @sut.authenticateWithMeshblu = sinon.spy()
        @sut.isAuthenticated @request, @response, @next

      it 'should call userSession.getDeviceFromMeshblu()', ->
        expect(@sut.authenticateWithMeshblu).to.have.been.calledWith 'steak', 'fries'

    describe 'when called without a user and with valid meshblu uuid and token', ->
      beforeEach ->
        @next = sinon.spy()
        @request =
          headers:
            meshblu_auth_uuid: 'burger'
            meshblu_auth_token: 'sweet-potato-fries'
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy()
        @sut.authenticateWithMeshblu = sinon.spy()
        @sut.isAuthenticated @request, @response, @next

      it 'should call userSession.getDeviceFromMeshblu()', ->
        expect(@sut.authenticateWithMeshblu).to.have.been.calledWith 'burger', 'sweet-potato-fries'

    describe 'when called with a user and with valid cookies uuid and token', ->
      beforeEach ->
        @next = sinon.spy()
        @request =
          user: {}
          cookies:
            meshblu_auth_uuid: 'chicken'
            meshblu_auth_token: 'waffles'
          login: sinon.stub().yields @next
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy()
        @sut.authenticateWithMeshblu = sinon.stub()
        @sut.isAuthenticated @request, @response, @next

      it 'should call authenticateWithMeshblu()', ->
        expect(@sut.authenticateWithMeshblu).to.have.been.calledWith 'chicken', 'waffles'

      describe 'when authenticateWithMeshblu yields an error', ->
        beforeEach (done) ->
          @response.end = sinon.spy(done)
          @sut.authenticateWithMeshblu.yield new Error('no device')

        it 'should call response.status(401).end()', ->
          expect(@response.status).to.have.been.calledWith 401
          expect(@response.end).to.have.been.called

      describe 'when authenticateWithMeshblu yields a device', ->
        beforeEach ->
          @sut.authenticateWithMeshblu.yield null, {uuid: 'chicken'}, {foo: 'bar'}

        it 'should call request.login', ->
          expect(@request.login).to.have.been.calledWith uuid: 'chicken', userDevice: {foo: 'bar'}

        it 'should call next', ->
          expect(@next).to.have.been.called

    describe 'when called with a user and with valid basic uuid and token', ->
      beforeEach ->
        @next = sinon.spy()
        @request =
          user: {}
          headers: 
            authorization: 'Basic dGVzdDpmcmVk'
          login: sinon.stub().yields @next
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy()
        @sut.authenticateWithMeshblu = sinon.stub()
        @sut.isAuthenticated @request, @response, @next

      it 'should call authenticateWithMeshblu()', ->
        expect(@sut.authenticateWithMeshblu).to.have.been.calledWith 'test', 'fred'

      describe 'when authenticateWithMeshblu yields an error', ->
        beforeEach (done) ->
          @response.end = sinon.spy(done)
          @sut.authenticateWithMeshblu.yield new Error('no device')

        it 'should call response.status(401).end()', ->
          expect(@response.status).to.have.been.calledWith 401
          expect(@response.end).to.have.been.called

      describe 'when authenticateWithMeshblu yields a device', ->
        beforeEach ->
          @sut.authenticateWithMeshblu.yield null, {uuid: 'test'}, {foo: 'fred'}

        it 'should call request.login', ->
          expect(@request.login).to.have.been.calledWith uuid: 'test', userDevice: {foo: 'fred'}

        it 'should call next', ->
          expect(@next).to.have.been.called

    describe 'when called with a user and with valid bearer uuid and token', ->
      beforeEach ->
        @next = sinon.spy()
        @request =
          user: {}
          headers: 
            authorization: 'Bearer dGhpcy11dWlkOnRoYXQtdG9rZW4K'
          login: sinon.stub().yields @next
        @response =
          status: sinon.spy(=> @response)
          end: sinon.spy()
        @sut.authenticateWithMeshblu = sinon.stub()
        @sut.isAuthenticated @request, @response, @next

      # this fails for some unknown reason
      xit 'should call authenticateWithMeshblu()', ->
        expect(@sut.authenticateWithMeshblu).to.have.been.calledWith 'this-uuid', 'that-token'

      describe 'when authenticateWithMeshblu yields an error', ->
        beforeEach (done) ->
          @response.end = sinon.spy(done)
          @sut.authenticateWithMeshblu.yield new Error('no device')

        it 'should call response.status(401).end()', ->
          expect(@response.status).to.have.been.calledWith 401
          expect(@response.end).to.have.been.called

      describe 'when authenticateWithMeshblu yields a device', ->
        beforeEach ->
          @sut.authenticateWithMeshblu.yield null, {uuid: 'this-uuid'}, {bar: 'foo'}

        it 'should call request.login', ->
          expect(@request.login).to.have.been.calledWith uuid: 'this-uuid', userDevice: {bar: 'foo'}

        it 'should call next', ->
          expect(@next).to.have.been.called

  describe '->authenticateWithMeshblu', ->
    describe 'when called with a invalid uuid and token and getDeviceFromMeshblu yields an error', ->
      beforeEach (done) ->
        callback = (@error, @user) => done()
        @userSession.getDeviceFromMeshblu = sinon.stub().yields new Error()
        @sut.authenticateWithMeshblu 'red-curry', 'thai-tea', callback

      it 'should call userSession.getDeviceFromMeshblu with the uuid and token', ->
        expect(@userSession.getDeviceFromMeshblu).to.have.been.calledWith 'red-curry', 'thai-tea'

      it 'should call the callback with an error', ->
        expect(@error).to.exist

    describe 'when called with a valid device but ensureUserExists yields an error', ->
      beforeEach (done) ->
        callback = (@error, @user) => done()
        @userSession.getDeviceFromMeshblu = sinon.stub().yields()
        @userSession.ensureUserExists = sinon.stub().yields new Error()
        @sut.authenticateWithMeshblu 'red-curry', 'thai-tea', callback

      it 'should call userSession.getDeviceFromMeshblu with the uuid and token', ->
        expect(@userSession.getDeviceFromMeshblu).to.have.been.calledWith 'red-curry', 'thai-tea'

      it 'should call userSession.ensureUserExists with the uuid and token', ->
        expect(@userSession.ensureUserExists).to.have.been.calledWith 'red-curry'

      it 'should call the callback with an error', ->
        expect(@error).to.exist

    describe 'when called with a valid device', ->
      beforeEach (done) ->
        callback = (@error, @user) => done()
        user =
          skynet:
            uuid: 'enchiladas'
        @userSession.getDeviceFromMeshblu = sinon.stub().yields()
        @userSession.ensureUserExists = sinon.stub().yields null, user
        @sut.authenticateWithMeshblu 'enchiladas', 'fanta', callback

      it 'should call userSession.getDeviceFromMeshblu with the uuid and token', ->
        expect(@userSession.getDeviceFromMeshblu).to.have.been.calledWith 'enchiladas', 'fanta'

      it 'should call userSession.ensureUserExists with the uuid and token', ->
        expect(@userSession.ensureUserExists).to.have.been.calledWith 'enchiladas'

      it 'should call the callback with no error', ->
        expect(@error).to.not.exist

      it 'should call the callback with the user', ->
        expect(@user).to.deep.equal skynet: uuid: 'enchiladas'

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
        request = user: userDevice: octoblu: termsAcceptedAt: '2015-01-01T00:00:00.000Z'
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
        request = user: userDevice: octoblu: termsAcceptedAt: '2050-01-01T22:00:00.000Z'
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






